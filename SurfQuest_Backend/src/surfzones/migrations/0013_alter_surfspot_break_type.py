# Generated by Django 5.1.4 on 2025-01-16 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surfzones', '0012_alter_continent_id_alter_country_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surfspot',
            name='break_type',
            field=models.CharField(blank=True, choices=[('Beach break', 'Beach break'), ('Reef break', 'Reef break'), ('Point break', 'Point break'), ('River mouth', 'River mouth'), ('Slab', 'Slab')], max_length=20),
        ),
    ]