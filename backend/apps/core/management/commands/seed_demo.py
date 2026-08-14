"""Seed demo data so every page of the frontend has something to show.

Usage: python manage.py seed_demo
"""
from django.core.management.base import BaseCommand

from apps.core.models import (
    BrandDocument,
    BrandVoice,
    ContentItem,
    Goal,
    Persona,
    Task,
)
from apps.core.services import rag


class Command(BaseCommand):
    help = 'Seed demo data (goals, tasks, content, brand voice, personas, one indexed brand document).'

    def handle(self, *args, **options):
        # Brand voice (singleton)
        voice = BrandVoice.get_singleton()
        voice.description = (
            'We are a helpful, authoritative yet accessible SaaS brand. We speak to social '
            'media managers as peers, optimistic and data-driven, slightly witty but never '
            'unprofessional. We avoid jargon unless it is industry-standard.'
        )
        voice.power_words = ['Growth', 'Scale', 'Automate', 'Strategy', 'ROI']
        voice.negative_words = ['Cheap', 'Hack', 'Viral', 'Guaranteed']
        voice.save()

        # Personas
        Persona.objects.get_or_create(
            name='The Busy Founder',
            defaults={
                'description': 'Startup CEO with no time for consistency.',
                'pain_points': ['No time for consistency', 'Spread too thin'],
                'goals': ['Efficiency', 'Scale', 'Automation'],
            },
        )
        Persona.objects.get_or_create(
            name='Agency Alice',
            defaults={
                'description': 'Social media manager overwhelmed by client approvals.',
                'pain_points': ['Overwhelmed by client approvals', 'Tight deadlines'],
                'goals': ['Faster approvals', 'Fewer revisions'],
            },
        )

        # A brand document, indexed through the real RAG pipeline
        doc, created = BrandDocument.objects.get_or_create(
            title='Brand Guidelines',
            defaults={
                'content': (
                    'Agent.ai is an AI-powered social media management platform for modern '
                    'marketing teams. Our mission: stop spending hours on content. Agent.ai '
                    'learns your brand voice, drafts posts, schedules content, and analyzes '
                    'performance automatically. Tone: optimistic, data-driven, slightly witty, '
                    'never unprofessional. Always use Oxford commas. Never mention competitors '
                    'by name. Use at most 2 emojis per post. Always include a call to action. '
                    'Format dates as MM/DD/YYYY. Our flagship features are Brand Memory, Smart '
                    'Scheduling, Predictive Analytics, and Multi-Channel Repurposing. We serve '
                    'social media managers, CMOs, and growth leads at startups and agencies.'
                ),
                'source': 'seed_demo',
            },
        )
        if created:
            chunk_count = rag.index_document(doc)
            self.stdout.write(self.style.SUCCESS(f'Indexed "{doc.title}" into {chunk_count} chunks.'))
        else:
            self.stdout.write(f'"{doc.title}" already exists, skipping re-index.')

        # Goals + tasks
        if not Goal.objects.exists():
            goal = Goal.objects.create(title='Increase Q3 Brand Awareness', progress=65)
            Task.objects.create(goal=goal, title='Draft 5 LinkedIn posts about AI trends', reasoning='Based on high engagement of last week\'s tech posts.')
            Task.objects.create(goal=goal, title='Create Instagram carousel for new feature', reasoning='Visual content needed for product launch goal', status=Task.Status.IN_PROGRESS)
            Task.objects.create(goal=goal, title='Analyze competitor Q3 performance', reasoning='Quarterly benchmark required for strategy adjustment', status=Task.Status.COMPLETED)

            goal2 = Goal.objects.create(title='Grow LinkedIn Followers to 10k', progress=85)
            Task.objects.create(goal=goal2, title='Publish weekly thought-leadership articles', reasoning='Consistent publishing grows reach organically.')

        # Content awaiting approval
        if not ContentItem.objects.exists():
            ContentItem.objects.create(
                platform=ContentItem.Platform.TWITTER,
                content='🚀 AI is changing how we work, but it\'s not replacing creativity. It\'s amplifying it. Here are 3 ways to use AI as your creative partner. 🧵👇',
                reasoning='Aligns with "Thought Leadership" goal. Uses thread format for higher engagement.',
                scheduled_time='Tomorrow, 9:00 AM',
            )
            ContentItem.objects.create(
                platform=ContentItem.Platform.LINKEDIN,
                content='Excited to announce our new Slack integration! Now you can manage social approvals directly from your team channels. 📈',
                reasoning='Product launch announcement. Professional tone matched to LinkedIn audience.',
                scheduled_time='Wed, 2:00 PM',
            )

        self.stdout.write(self.style.SUCCESS('Demo data ready.'))
