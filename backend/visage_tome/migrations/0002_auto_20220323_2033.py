# Generated by Django 3.2.8 on 2022-03-24 02:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('visage_tome', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='editablesetting',
            options={'verbose_name_plural': 'Editable Settings'},
        ),
        migrations.AddField(
            model_name='editablesetting',
            name='like_lifespan_add',
            field=models.IntegerField(default=1),
        ),
    ]