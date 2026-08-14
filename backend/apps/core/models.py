from django.db import models


class Goal(models.Model):
    """A high-level objective the AI agent breaks down into tasks."""

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        PAUSED = 'paused', 'Paused'

    title = models.CharField(max_length=255)
    progress = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def task_count(self) -> int:
        return self.tasks.count()

    def __str__(self) -> str:
        return self.title


class Task(models.Model):
    """A single actionable step generated for a Goal."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in-progress', 'In progress'
        COMPLETED = 'completed', 'Completed'

    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    reasoning = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class ContentItem(models.Model):
    """AI-generated post awaiting approval before scheduling."""

    class Platform(models.TextChoices):
        TWITTER = 'twitter', 'Twitter'
        INSTAGRAM = 'instagram', 'Instagram'
        LINKEDIN = 'linkedin', 'LinkedIn'
        EMAIL = 'email', 'Email'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        REVISION_REQUESTED = 'revision-requested', 'Revision requested'

    platform = models.CharField(max_length=20, choices=Platform.choices, default=Platform.TWITTER)
    content = models.TextField()
    image = models.URLField(blank=True, default='')
    reasoning = models.TextField(blank=True, default='')
    scheduled_time = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    author = models.CharField(max_length=100, default='Agent')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.platform}: {self.content[:60]}'


class Persona(models.Model):
    """An audience persona the AI writes for."""

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    pain_points = models.JSONField(default=list, blank=True)
    goals = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return self.name


class BrandVoice(models.Model):
    """Singleton holding the brand's voice/tone configuration."""

    description = models.TextField(
        blank=True,
        default='',
        help_text='Describe your brand personality, values and communication style.',
    )
    formal_casual = models.PositiveSmallIntegerField(default=60, help_text='0 = casual, 100 = formal')
    serious_playful = models.PositiveSmallIntegerField(default=40, help_text='0 = playful, 100 = serious')
    detail_level = models.PositiveSmallIntegerField(default=30, help_text='0 = short & punchy, 100 = detailed')
    power_words = models.JSONField(default=list, blank=True)
    negative_words = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'brand voices'

    def __str__(self) -> str:
        return 'Brand Voice'

    @classmethod
    def get_singleton(cls) -> 'BrandVoice':
        voice, _ = cls.objects.get_or_create(pk=1)
        return voice


class BrandDocument(models.Model):
    """A brand knowledge document (guidelines, product copy, tone samples...).

    This is the *source* material for RAG: it gets chunked, embedded and
    stored as DocumentChunk rows, then retrieved to ground AI generation.
    """

    title = models.CharField(max_length=255)
    content = models.TextField()
    source = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class DocumentChunk(models.Model):
    """A chunk of a BrandDocument plus its embedding vector.

    Embeddings are stored as a JSON list so the same model works on SQLite
    and Postgres. Retrieval is done in pure Python (see services/rag.py) —
    the exact same math pgvector does with its `<=>` operator, which is the
    upgrade path for production (see README).
    """

    document = models.ForeignKey(BrandDocument, on_delete=models.CASCADE, related_name='chunks')
    content = models.TextField()
    embedding = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.document.title} — {self.content[:60]}'
