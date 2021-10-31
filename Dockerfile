# Указывает Docker использовать официальный образ python 3 с dockerhub в качестве базового образа
FROM python:3
# Устанавливает переменную окружения, которая гарантирует, что вывод из python будет отправлен прямо в терминал без предварительной буферизации
ENV PYTHONUNBUFFERED 1
#Python не будет пытаться создавать файлы .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# Устанавливает рабочий каталог контейнера — "code"
WORKDIR /code
#скопировали файл requirements.txt
COPY requirements.txt /code/
#установили зависимости и скопировали сам проект Django.
RUN pip install -r requirements.txt
COPY . /code/