# start by pulling the python image
FROM python:3.10

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

#create .env with IP variable inside dmie
RUN echo "IP=YOUR_FIWARE_IP_ADDRESS" > /app/dmie/.env

# set the FLASK_APP environment variable
ENV FLASK_APP=dmie

# configure the container to run in an executed manner
ENTRYPOINT [ "python3" ]

# initialize the database
RUN flask --app dmie init-db

CMD ["-m", "flask", "run", "--host=0.0.0.0"]
#CMD ["flask", "--app", "dmie", "run"]

