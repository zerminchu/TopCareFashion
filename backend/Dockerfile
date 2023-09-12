# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.10-slim


# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /backend


RUN pip install --upgrade pip
RUN pip install tensorflow
RUN pip install gcloud
RUN pip install tensorflow-intel
RUN pip install google-api-core
RUN pip install google-cloud-firestore
RUN pip install googleapis-common-protos
RUN pip install grpcio-status
RUN pip install mysql-connector-python
RUN pip install pyqt5
RUN pip install protobuf

COPY . /backend


# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8000



