# Generated by Django 5.1.2 on 2024-11-25 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_alter_cliente_direccion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='direccion',
            field=models.TextField(blank=True, null=True),
        ),
    ]
