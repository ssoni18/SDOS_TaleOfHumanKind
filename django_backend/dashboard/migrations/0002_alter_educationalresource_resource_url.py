# Generated by Django 4.2.3 on 2023-11-03 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='educationalresource',
            name='resource_url',
            field=models.URLField(null=True),
        ),
    ]
