```bash
# Local Database
#--------------------------------------------------------------------------------------------------
# starting psql db:
brew services start postgresql
# connecting to local DB
psql -U "Admin44" -h 127.0.0.1 -d surfquest_psql_db
# List db:
brew services list
# Check local env config
printenv | grep LOCAL_DATABASE

# -------------------------------------------------------------------------------------------------
# attaching to a container
docker exec -it django_app bash 
#checking docker env
docker exec -it django_app env | grep ENVIRONMENT

# Django shell
docker exec -it django_app python manage.py shell  
# Docker DB shell
docker exec -it django_app python manage.py dbshell

# Force building with .env
docker-compose --env-file .env build --no-cache
docker-compose --env-file .env up -d

# access container
docker exec -it nextjs_app sh
docker exec -it django_app sh
docker logs django_app -f
# install curl in container
apk add --no-cache curl

docker exec -it nextjs_app sh

wget -qO- http://backend:8000/api/users/ --post-data='{"username":"test","password":"test","email":"test@example.com"}' \
--header='Content-Type: application/json' --header='Accept: application/json'

curl -X POST http://backend:8000/api/users/ \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{"username": "test2", "password": "testpassword", "email2": "test@example.com"}'

# .env
#------------------------------------------------------------------------------------------
source .env

```