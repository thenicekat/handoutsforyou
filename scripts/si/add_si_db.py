"""
@author: Divyateja Pasupuleti
@about: Script to add si chronicles to the database, note: always comment insert and check if data is valid
"""
import os
from supabase import create_client, Client
import dotenv
import json
import argparse

parser = argparse.ArgumentParser(description="Add SI chronicles to the database")
parser.add_argument("--insert", action="store_true", help="Insert data into the database")
args = parser.parse_args()

if args.insert:
    insert = True
else:
    insert = False
    
print(f"Inserting data: {insert}")

dotenv.load_dotenv(dotenv_path="../.env.local")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)
year: str = "2021-2022"

with open("SI.json", "r") as f:
    si_chronicles = json.load(f)

for company in si_chronicles.keys():
    # Get name
    name = company.strip()
    
    # Get eligibility
    try:
        eligibility = si_chronicles[company]["Eligibility"].strip()
    except:
        try:
            eligibility = si_chronicles[company]["Eligibility "].strip()
        except:
            print(f"Error with eligibility: {company}")
            eligibility = "NA"
    try:
        cgpa_cutoff = si_chronicles[company]["CGPA Cut-off"].strip()
    except:
        try:
            cgpa_cutoff = si_chronicles[company]["CGPA cutoff"].strip()
        except:
            try:
                cgpa_cutoff = si_chronicles[company]["CGPA Cutoff"].strip()
            except:
                try:
                    cgpa_cutoff = si_chronicles[company]["CGPA"].strip()
                except:
                    try:
                        cgpa_cutoff = si_chronicles[company]["CGPA Cut-off "].strip()
                    except:
                        print(f"Error with cutoff: {company}")
                        cgpa_cutoff = "NA"
            
    # Get roles
    try:
        roles = si_chronicles[company]["Roles"].strip()
    except:
        try:
            roles = si_chronicles[company]["Role"].strip()
        except:
            print(f"Error with getting roles: {company}")
            roles = "NA"
            
    # Get selects
    selects = si_chronicles[company]["Selects"].strip()
    
    # Get selection rounds
    selection_rounds = si_chronicles[company]["Selection Rounds"].strip()
    
    # Get Stipend
    try:
        stipend = si_chronicles[company]["Stipend"].strip()
    except:
        try:
            stipend = si_chronicles[company]["STIPEND"].strip()
        except:
            try: 
                stipend = si_chronicles[company]["CTC"].strip()
            except:
                print(f"Error: {company}")
                break
    
    if insert:
        supabase.table("si_companies").insert({
            "name": name,
            "eligibility": eligibility,
            "cgpa_cutoff": cgpa_cutoff,
            "roles": roles,
            "selects": selects,
            "selection_rounds": selection_rounds,
            "stipend": stipend,
            "year": year
        }).execute()
    
    chronicles = si_chronicles[company]["data"]
    for chronicle in chronicles:
        chronicle_data = {}
        for key in chronicle.keys():
            chronicle_data["name"] = key.strip()
            chronicle_data["company"] = name
            chronicle_data["year"] = year
            
            if "CGPA" not in chronicle[key].keys():
                chronicle_data["cgpa"] = "NA"
            else:
                chronicle_data["cgpa"] = chronicle[key]["CGPA"].strip()
                
            if "Role" not in chronicle[key].keys():
                chronicle_data["role"] = "NA"
            else:
                chronicle_data["role"] = chronicle[key]["Role"].strip()
                
            chronicle_data["text"] = chronicle[key]["Text"].strip()
        
        if insert:  
            supabase.table("si_chronicles").insert(chronicle_data).execute()