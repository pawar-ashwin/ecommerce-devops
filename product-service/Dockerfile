# product-service/Dockerfile

FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Install system packages required for mysqlclient and netcat
RUN apt-get update && \
    apt-get install -y \
    gcc \
    netcat-openbsd \
    default-libmysqlclient-dev \
    build-essential \
    libmariadb-dev-compat \
    libmariadb-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code
COPY . .

# Copy the wait script into the image and make it executable
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# Set entrypoint to the wait script
ENTRYPOINT ["/wait-for-mysql.sh"]

# Run Django after the DB is ready
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
