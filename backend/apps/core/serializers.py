from rest_framework import serializers

from apps.core.models import (
    BrandDocument,
    BrandVoice,
    ContentItem,
    Goal,
    Persona,
    Task,
)


class GoalSerializer(serializers.ModelSerializer):
    task_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'title', 'progress', 'task_count', 'status', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'reasoning', 'status', 'goal', 'created_at']


class ContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = [
            'id',
            'platform',
            'content',
            'image',
            'reasoning',
            'scheduled_time',
            'status',
            'author',
            'created_at',
        ]


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id', 'name', 'description', 'pain_points', 'goals']


class BrandVoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandVoice
        fields = [
            'id',
            'description',
            'formal_casual',
            'serious_playful',
            'detail_level',
            'power_words',
            'negative_words',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']


class BrandDocumentSerializer(serializers.ModelSerializer):
    chunk_count = serializers.SerializerMethodField()

    class Meta:
        model = BrandDocument
        fields = ['id', 'title', 'content', 'source', 'chunk_count', 'created_at']
        read_only_fields = ['chunk_count', 'created_at']

    def get_chunk_count(self, obj: BrandDocument) -> int:
        return obj.chunks.count()


class BrandQuerySerializer(serializers.Serializer):
    question = serializers.CharField()
    top_k = serializers.IntegerField(min_value=1, max_value=20, default=5)


class PlanGeneratorSerializer(serializers.Serializer):
    description = serializers.CharField(
        help_text='Describe the goal, e.g. "Increase our Twitter engagement by 20% this month".'
    )
