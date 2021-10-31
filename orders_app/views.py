from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from orders_app.forms import *
from orders_app.models import *
import calendar
import json, datetime
import base64
from django.contrib.auth import authenticate
from django.core import serializers
from django.db.models import Sum

#управление заказами
@login_required(login_url='/orders/all/')
def orders(request):
    template = 'orders.html'
    orders = Order.objects.order_by('date')
    form = OrderForm()
    return render(request, template, { 'orders':orders, 'form':form,})

#добавить заказ
@login_required(login_url='/orders/all/')
def new_order(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            form_for_save = form.save(commit=False)
            form_for_save.save()
         
            return HttpResponse(json.dumps({'result': 'success', 'id':str(form_for_save.id), 'user':form_for_save.user.get_full_name(), 'date':form_for_save.date.strftime('%d.%m.%Y'), 'summ':str(form_for_save.summ),}), content_type="application/json")
        else:
            response = ''
            for k in form.errors:
                response = response + '%s: %s' % (k, form.errors[k][0])
            return HttpResponse(json.dumps({'response': response, 'result': 'error'}), content_type="application/json")

#удалить заказ
@login_required(login_url='/orders/all/')
def delete_order(request, id):    
    f = Order.objects.get(pk=id)
    f.delete()
    return HttpResponse("") 

#все заказы      
def all_orders(request):
    template = 'all_orders.html'
    date = datetime.datetime.today()
    week = date.strftime("%V")
    day = date.strftime("%d")
    month = date.strftime("%m")
    year = date.strftime("%Y")
    
    c = calendar.Calendar(firstweekday=0)
    weeks = c.monthdayscalendar(int(year),int(month))
    new_weeks = []
    for ind, w in enumerate(weeks): #Убираем 0 из списка
        w = [i for i in w if i!=0]
        new_weeks.append(w)
        if int(day) in w:
            chosen_week = ind      
    if request.method == 'GET' and request.GET.get('chosen_week'): 
        chosen_week = request.GET.get('chosen_week') 
        day_of_week = new_weeks[int(chosen_week)][0] #берём первую дату из недели
        new_date = datetime.datetime.strptime(str(day_of_week)+'.'+month+'.'+year, '%d.%m.%Y')
        week = new_date.strftime("%V") #находим номер выбранной недели
    orders = Order.objects.filter(date__week=week).order_by('date') 
    itog = orders.aggregate(orders_summ = Sum('summ')) 
    users = User.objects.filter(orders__id__in=orders.values('id')).distinct()    
    return render(request, template, { 'orders':orders, 'weeks':new_weeks, 'chosen_week':int(chosen_week), 'itog':itog, 'users':users,})

def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()
        
#экспорт данных
def export_data(request):
    
    if 'HTTP_AUTHORIZATION' in request.META:
   
        auth = request.META.get('HTTP_AUTHORIZATION', None).split()

        if len(auth) == 2:
            if auth[0].lower() == "basic":
                users = base64.b64decode(auth[1]).decode().split(':')
                            
                user = authenticate(username=users[0], password=users[1])
                if user and user.is_active:
                    request.user = user
                    response_data = {}
                    orders = list(Order.objects.all().values_list('user__username','date','summ'))   
                    qs_json = [str(x) for x in orders]                   
                    response_data['orders'] = orders
                    return HttpResponse(json.dumps(response_data, default = myconverter), content_type="application/json")


    response = HttpResponse()
    response.status_code = 401
    response['WWW-Authenticate'] = 'Basic realm="%s"' % "Basc Auth Protected"
    return response
    return response


