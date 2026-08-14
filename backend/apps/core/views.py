import json
import re

from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.core.models import (
    BrandDocument,
    BrandVoice,
    ContentItem,
    Goal,
    Persona,
    Task,
)
from apps.core.serializers import (
    BrandDocumentSerializer,
    BrandQuerySerializer,
    BrandVoiceSerializer,
    ContentItemSerializer,
    GoalSerializer,
    PersonaSerializer,
    PlanGeneratorSerializer,
    TaskSerializer,
)
from apps.core.services import llm, rag


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all().order_by('-created_at')
    serializer_class = GoalSerializer

    def get_serializer_class(self):
        if self.action == 'tasks':
            return TaskSerializer
        return GoalSerializer

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        goal = self.get_object()
        tasks = goal.tasks.all().order_by('created_at')
        return Response(TaskSerializer(tasks, many=True).data)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('created_at')
    serializer_class = TaskSerializer


class ContentItemViewSet(viewsets.ModelViewSet):
    queryset = ContentItem.objects.all().order_by('-created_at')
    serializer_class = ContentItemSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        item = self.get_object()
        item.status = ContentItem.Status.APPROVED
        item.save(update_fields=['status'])
        return Response(ContentItemSerializer(item).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        item = self.get_object()
        item.status = ContentItem.Status.REJECTED
        item.save(update_fields=['status'])
        return Response(ContentItemSerializer(item).data)


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all().order_by('name')
    serializer_class = PersonaSerializer


@api_view(['GET', 'PUT'])
def brand_voice(request):
    """Read or update the singleton Brand Voice configuration."""
    voice = BrandVoice.get_singleton()
    if request.method == 'GET':
        return Response(BrandVoiceSerializer(voice).data)
    serializer = BrandVoiceSerializer(voice, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


class BrandDocumentViewSet(viewsets.ModelViewSet):
    queryset = BrandDocument.objects.all().order_by('-created_at')
    serializer_class = BrandDocumentSerializer

    def perform_create(self, serializer):
        """Ingest = save document, then chunk + embed + store (RAG step 1-3)."""
        document = serializer.save()
        rag.index_document(document)


@api_view(['POST'])
def brand_query(request):
    """RAG query: retrieve the most relevant chunks, generate a grounded answer."""
    serializer = BrandQuerySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    answer_text, sources = rag.answer(
        serializer.validated_data['question'],
        top_k=serializer.validated_data['top_k'],
    )
    return Response({'answer': answer_text, 'sources': sources})


@api_view(['POST'])
def generate_plan(request):
    """Turn a goal description into tasks + content drafts.

    This is a mini-RAG flow: the brand voice and any indexed brand documents
    are used as context so generated plans match the brand.
    """
    serializer = PlanGeneratorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    description = serializer.validated_data['description']

    voice = BrandVoice.get_singleton()
    brand_context = voice.description or 'A modern, helpful SaaS brand.'
    if voice.power_words:
        brand_context += f'\nUse these words often: {", ".join(voice.power_words)}.'
    if voice.negative_words:
        brand_context += f'\nNever use these words: {", ".join(voice.negative_words)}.'

    # Retrieve relevant brand material (RAG step 4) to ground the plan.
    sources = rag.retrieve(description, top_k=3)
    if sources:
        brand_context += '\nRelevant brand material:\n' + '\n\n'.join(
            f'[{s["document_title"]}] {s["content"]}' for s in sources
        )

    if llm.llm_enabled():
        plan = _generate_plan_with_llm(description, brand_context)
    else:
        plan = _demo_plan(description)
    if plan is None:
        plan = _demo_plan(description)

    goal = Goal.objects.create(title=description, progress=0)
    tasks = [Task.objects.create(goal=goal, **t) for t in plan.get('tasks', [])]
    posts = [ContentItem.objects.create(**p) for p in plan.get('posts', [])]

    return Response(
        {
            'goal': GoalSerializer(goal).data,
            'tasks': TaskSerializer(tasks, many=True).data,
            'content_items': ContentItemSerializer(posts, many=True).data,
        },
        status=status.HTTP_201_CREATED,
    )


def _generate_plan_with_llm(description: str, brand_context: str) -> dict | None:
    prompt = f"""
Goal: {description}

Brand context:
{brand_context}

Return ONLY strict JSON (no markdown fences) in this exact shape:
{{
  "tasks": [
    {{"title": "short actionable task", "reasoning": "why this helps the goal"}}
  ],
  "posts": [
    {{"platform": "twitter|instagram|linkedin|email", "content": "draft post text", "reasoning": "why this post"}}
  ]
}}
Include 3-5 tasks and 2-4 posts. Keep content in the brand's voice.
"""
    raw = llm.generate(prompt, system='You are the content planner for a social media marketing agent.')
    return _parse_json(raw)


def _parse_json(raw: str) -> dict | None:
    """Tolerate markdown code fences and stray text around the JSON."""
    match = re.search(r'\{[\s\S]*\}', raw)
    if not match:
        return None
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data


def _demo_plan(description: str) -> dict:
    """Canned plan used in mock mode (no GEMINI_API_KEY) so the flow is demoable."""
    return {
        'tasks': [
            {
                'title': f'Research the audience for: {description[:80]}',
                'reasoning': 'Understand what resonates before creating content.',
            },
            {
                'title': 'Draft 3 platform-specific posts for this goal',
                'reasoning': 'Each platform has its own format and audience.',
            },
            {
                'title': 'Schedule posts at optimal times and monitor engagement',
                'reasoning': 'Consistency and iteration drive results.',
            },
        ],
        'posts': [
            {
                'platform': 'twitter',
                'content': f'We are working on "{description}". Follow along for updates! 🚀',
                'reasoning': 'Short, punchy update with a hook.',
            },
            {
                'platform': 'linkedin',
                'content': f'New goal unlocked: {description}. Here is how we plan to get there — thread 👇',
                'reasoning': 'Professional, thought-leadership tone for LinkedIn.',
            },
            {
                'platform': 'email',
                'content': f'Subject: Our plan to {description[:60].lower()} 📬',
                'reasoning': 'Weekly stakeholder update keeps the team aligned.',
            },
        ],
    }


# --- Auth (simple token auth, MVP-grade) -------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    if not username or not password:
        return Response(
            {'error': 'username and password are required'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(username=username).exists():
        return Response({'error': 'username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password, email=email)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)
