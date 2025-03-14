# Generated by Django 5.1.4 on 2025-01-11 11:33

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surfzones', '0006_alter_surfspot_best_tide_alter_surfspot_surf_level'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='surfspot',
            name='left',
        ),
        migrations.RemoveField(
            model_name='surfspot',
            name='left_and_right',
        ),
        migrations.RemoveField(
            model_name='surfspot',
            name='right',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='best_month',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='couple',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='family',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='lefts',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='lefts_and_rights',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='rights',
        ),
        migrations.RemoveField(
            model_name='surfzone',
            name='solo',
        ),
        migrations.AddField(
            model_name='surfspot',
            name='wave_direction',
            field=models.CharField(blank=True, choices=[('left', 'Left'), ('right', 'Right'), ('left_and_right', 'Left and Right')], max_length=20),
        ),
        migrations.AddField(
            model_name='surfzone',
            name='best_months',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AddField(
            model_name='surfzone',
            name='main_wave_direction',
            field=models.CharField(blank=True, choices=[('left', 'Left'), ('right', 'Right'), ('left_and_right', 'Left and Right')], max_length=20),
        ),
        migrations.AddField(
            model_name='surfzone',
            name='traveler_type',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Solo', 'Solo'), ('Couple', 'Couple'), ('Family', 'Family'), ('Group', 'Group')], max_length=20), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfspot',
            name='best_months',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfspot',
            name='best_tide',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('low', 'Low'), ('mid', 'Mid'), ('high', 'High')], max_length=20), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfspot',
            name='surf_hazards',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfspot',
            name='surf_level',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced'), ('pro', 'Pro')], max_length=20), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfzone',
            name='health_hazards',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='surfzone',
            name='surf_hazards',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
    ]
