#!/bin/sh

echo "Waiting for mysql..."

while ! nc -z mysql 3306; do
  sleep 1
done

echo "MySQL is up - starting Django"

exec "$@"
