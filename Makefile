all:
	docker-compose build

run:
	docker-compose up 

shell:
	docker-compose run --rm project /bin/bash

stop:
	docker-compose down
