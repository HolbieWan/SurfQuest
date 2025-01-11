# Main bash commands for Django

```bash
django-admin startproject "project_name"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
python3 manage.py startapp "app_name"
python3 manage.py createsuperuser
python manage.py loaddata ".json" 
#python manage.py loaddata surfzones/fixtures/surf-spots_data.json
```
```bash
/opt/homebrew/bin/psql -U $(whoami) -d postgres # CREATE DATABASE
/opt/homebrew/bin/psql # connect to postgresSQL DB
```