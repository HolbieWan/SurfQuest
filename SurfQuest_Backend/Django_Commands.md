# Main bash commands for Django

```bash
django-admin startproject "project_name"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
python3 manage.py startapp "app_name"
python3 manage.py createsuperuser
python manage.py loaddata ".json" 
# python manage.py loaddata surfzones/fixtures/surf-spots_data.json
```
```bash
/opt/homebrew/bin/psql -U $(whoami) -d postgres # CREATE DATABASE
/opt/homebrew/bin/psql # connect to postgresSQL DB

# Create a new PostgreSQL database
/opt/homebrew/bin/psql -U $(whoami) -d postgres -c "CREATE DATABASE db_name;"

# Connect to PostgreSQL
/opt/homebrew/bin/psql -U $(whoami) -d db_name

# List all databases
/opt/homebrew/bin/psql -U $(whoami) -d postgres -c "\l"

# List all tables in the current database
/opt/homebrew/bin/psql -U $(whoami) -d db_name -c "\dt"

# Describe a table
/opt/homebrew/bin/psql -U $(whoami) -d db_name -c "\d table_name"



# -------------------------------------------------------------------------------------------------------------------
# # in the docker container

# To build and run containers: 
# run in background without logs
docker-compose up -d --build
# or
# run in background with logs
docker-compose up --build

# to stop container
docker-compose down

# To run migrations
docker-compose exec web python manage.py migrate

# create superuser
docker-compose exec backend python manage.py createsuperuser

docker-compose exec backend python manage.py migrate
```