data = []

import os
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv(dotenv_path="../../.env.local")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)
year: str = "2023-2024"

for company in data:	
	supabase.table("si_companies").insert({
		"name": company["companyName"],
		"eligibility": "Not Available",
		"cgpa_cutoff": "Not Available",
		"roles": company["name"],
		"stipend": company["jobDescription"][3],
		"year": year,
		"otherdetails": " | ".join(company["otherInfo"]),
	}).execute()