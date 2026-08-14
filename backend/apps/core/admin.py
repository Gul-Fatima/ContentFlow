from django.contrib import admin

from apps.core.models import (
    BrandDocument,
    BrandVoice,
    ContentItem,
    DocumentChunk,
    Goal,
    Persona,
    Task,
)

admin.site.register(Goal)
admin.site.register(Task)
admin.site.register(ContentItem)
admin.site.register(Persona)
admin.site.register(BrandVoice)
admin.site.register(BrandDocument)
admin.site.register(DocumentChunk)
