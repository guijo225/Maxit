import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
import os

# FORCER LE CHARGEMENT avec le chemin absolu
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')

print(f"Chemin du fichier .env : {env_path}")
print(f"Fichier .env existe : {os.path.exists(env_path)}")

# Charger avec le chemin explicite
load_dotenv(dotenv_path=env_path, override=True)

# VÉRIFICATION
print("=== VARIABLES D'ENVIRONNEMENT ===")
print(f"DB_HOST: '{os.getenv('DB_HOST')}'")
print(f"DB_USER: '{os.getenv('DB_USERNAME')}'")
print(f"DB_NAME: '{os.getenv('DB_DATABASE')}'")
print(f"DB_PASSWORD: '{os.getenv('DB_PASSWORD')}'")
print("=====================================")

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "dbname": os.getenv("DB_DATABASE"),
    "user": os.getenv("DB_USERNAME"),
    "password": os.getenv("DB_PASSWORD")
}

def get_db_connection():
    try: 
        conn = psycopg2.connect(
            **DB_CONFIG, 
            cursor_factory=RealDictCursor
        )
        return conn
    except psycopg2.Error as e: 
        print(f"Erreur de connexion à la bd : {e}")
        raise