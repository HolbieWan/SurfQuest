# Generated by Django 5.1.4 on 2025-01-10 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surfzones', '0004_alter_surfspot_best_months_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surfspot',
            name='best_tide',
            field=models.CharField(blank=True, choices=[('low', 'Low'), ('mid', 'Mid'), ('high', 'High')], max_length=20),
        ),
    ]
