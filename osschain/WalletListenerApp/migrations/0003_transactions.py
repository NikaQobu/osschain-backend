# Generated by Django 5.0.6 on 2024-07-19 19:20

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('WalletListenerApp', '0002_pushinfo_delete_pushnotifications'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField()),
                ('sender', models.BooleanField()),
                ('receiver', models.BooleanField()),
                ('sender_address', models.CharField(max_length=255)),
                ('receiver_address', models.CharField(max_length=255)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
