"""
    File is contains the model for the main Visage Tome app
    Related Functional Requirements:
    * FR6 - Post.LifeSpan
    * FR7 - Change.LifeSpan
"""

from django.db import models

# Singleton model for Django
# https://www.rootstrap.com/blog/simple-dynamic-settings-for-django/
class Singleton(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super(Singleton, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

class EditableSetting(Singleton):
    class Meta:
        verbose_name_plural = "Editable Settings"

    # lifespan are in unit of days
    guest_post_lifespan = models.IntegerField(default=7)
    user_post_lifespan = models.IntegerField(default=30)
    like_lifespan_add = models.IntegerField(default=1)
