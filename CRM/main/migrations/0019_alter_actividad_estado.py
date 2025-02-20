# Generated by Django 5.1.3 on 2024-11-25 03:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_alter_cliente_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actividad',
            name='estado',
            field=models.CharField(choices=[('Pendiente', 'Pendiente'), ('Completada', 'Completada'), ('Suspendida', 'Suspendida')], default='Pendiente', max_length=15),
        ),
    ]
