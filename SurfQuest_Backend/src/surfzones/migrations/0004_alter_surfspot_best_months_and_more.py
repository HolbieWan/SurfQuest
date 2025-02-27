# Generated by Django 5.1.4 on 2025-01-09 22:51

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surfzones', '0003_alter_surfspot_surf_hazards'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surfspot',
            name='best_months',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='surfspot',
            name='description',
            field=models.TextField(blank=True, max_length=500),
        ),
    ]
