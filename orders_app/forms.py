# -*- coding:utf-8 -*-

from django import forms
from orders_app.models import *
from django.forms import CharField, ChoiceField, ModelForm

class OrderForm(ModelForm):
    class Meta:
        model = Order
        fields = ('user', 'summ',)
    def __init__(self, *args, **kwargs): 
        super(OrderForm, self).__init__(*args, **kwargs)
        self.fields['user'].queryset = UserFullName.objects.order_by('last_name')	