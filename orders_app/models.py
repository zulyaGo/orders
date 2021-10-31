# -*- coding:utf-8 -*-

from django.db import models
from django.contrib.auth.models import User

class ActiveUsersOnlyManager(models.Manager):
    def get_queryset(self):
        return super(ActiveUsersOnlyManager, self).get_queryset().filter(is_active=True)
		
class UserFullName(User):
    objects = ActiveUsersOnlyManager()
    class Meta:
        proxy = True

    def __str__(self):
        return '%s %s' % (self.last_name, self.first_name)
        
#заказ
class Order(models.Model):
    user = models.ForeignKey(User, verbose_name = 'Заказчик', on_delete=models.SET_NULL, null=True, related_name = 'orders')
    summ = models.FloatField(verbose_name = 'Сумма')	
    date = models.DateTimeField(verbose_name = 'Дата заказа', auto_now_add=True)
    class Meta:
        verbose_name = 'Заказ'
    
