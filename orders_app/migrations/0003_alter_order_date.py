# Generated by Django 3.2.8 on 2021-10-27 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders_app', '0002_auto_20211027_1017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Дата заказа'),
        ),
    ]
