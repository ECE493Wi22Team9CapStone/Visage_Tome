# Generated by Django 3.2.8 on 2022-03-24 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_auto_20220323_2018'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='username',
            field=models.CharField(default='Anonymous', max_length=100),
            preserve_default=False,
        ),
    ]
