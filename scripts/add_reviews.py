"""
Script to add reviews to the database
"""
import os
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv(dotenv_path="./../.env.local")

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_API_KEY")
supabase: Client = create_client(url, key)

course = ""
prof = ""

reviews = [
]

for review in reviews:
    data = supabase.table("reviews").insert({"course": course, "prof": prof, "review": review}).execute()
    assert len(data.data) > 0
