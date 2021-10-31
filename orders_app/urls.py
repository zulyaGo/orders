from django.urls import path
from orders_app import views

app_name = 'orders_app'

urlpatterns = [
    path('', views.orders, name='orders'),
    path('orders/new_order/', views.new_order, name='new_order'),
    path('orders/<int:id>/delete/', views.delete_order, name='delete_order'),
    path('orders/all/', views.all_orders, name='all_orders'),
    path('orders/export_data/', views.export_data, name='export_data'),
]