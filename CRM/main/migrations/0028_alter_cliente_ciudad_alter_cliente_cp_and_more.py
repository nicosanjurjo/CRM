# Generated by Django 5.1.3 on 2024-12-07 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0027_alter_cliente_numero_cliente'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='ciudad',
            field=models.CharField(blank=True, default='No disponible', max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='cp',
            field=models.CharField(blank=True, default='No disponible', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='direccion',
            field=models.CharField(blank=True, default='No disponible', max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='distribuidor',
            field=models.CharField(blank=True, default='No disponible', max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='estado',
            field=models.CharField(blank=True, default='No disponible', max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='pedidos',
            field=models.TextField(blank=True, default='No disponible', null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='telefono_casa',
            field=models.CharField(blank=True, default='No disponible', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='telefono_movil',
            field=models.CharField(blank=True, default='No disponible', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='telefono_trabajo',
            field=models.CharField(blank=True, default='No disponible', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='tipo',
            field=models.CharField(blank=True, default='No disponible', max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='cliente',
            name='vendedor',
            field=models.CharField(blank=True, default='No disponible', max_length=25, null=True),
        ),
    ]
