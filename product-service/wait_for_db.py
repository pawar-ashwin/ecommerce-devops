import time
import os
import django
from django.db import connections
from django.db.utils import OperationalError

# 👇 Set Django settings path manually
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'productapi.settings')
django.setup()

db_conn = None
max_tries = 20

while not db_conn:
    try:
        db_conn = connections['default']
        c = db_conn.cursor()
        print("✅ Database connection established.")
    except OperationalError:
        print("⏳ Database unavailable, waiting 1 second...")
        time.sleep(1)
