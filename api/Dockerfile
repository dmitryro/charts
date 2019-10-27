FROM python:3.7-slim

# Copying the requirements for installation to take
# advantage of the caching.
COPY requirements.txt .
RUN pip install -r ./requirements.txt
EXPOSE 8000
