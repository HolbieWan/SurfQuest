# Generated by Django 5.1.4 on 2025-01-16 12:32

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditions', '0002_remove_condition_advanced_remove_condition_beginner_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='condition',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]