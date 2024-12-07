"""
@author: Divyateja Pasupuleti
@about: Converts a csv file containing PS data into necessary format and pushes it to supabase
PS2 CSV Format: Email,ID,AllotmentRound,Station,CGPA,PreferenceNumber,OffshootScore,OffshootTotal,OffshootType
"""
import os
import pathlib

import dotenv
import pandas as pd
from tqdm import tqdm

from supabase import Client, create_client

ENV_PATH = pathlib.Path(__file__).parent.parent.parent / ".env.local"

assert (dotenv.load_dotenv(dotenv_path=ENV_PATH)), "Error loading .env file"

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(url, key)

# Constants
MASTER_FILE = pathlib.Path(__file__).parent / 'studata.csv'
TABLE_NAME = 'ps2_responses'
YEAR_AND_SEM = '24-25 Sem 2'

# Read csv file
df = pd.read_csv(MASTER_FILE)
df = df[df["Sem"] == "Semester 2"]
failed = 0
success = 0
already_exists = 0

current = supabase.table(TABLE_NAME).select('*').eq('year_and_sem', '24-25 Sem 2').execute()
for index, row in tqdm(df.iterrows(), total=df.shape[0]):
    try:
        campus = "hyderabad" if row["ID"][-1] == "H" else "goa" if row["ID"][-1] == "G" else "pilani"
        email = 'f' + row["ID"][0:4] + row["ID"][8:12] + "@" + campus + ".bits-pilani.ac.in"
        filtered = [res for res in current.data if res.get('email') == email]
        if len(filtered) > 0:
            # print(f"Campus: {campus}, Email: {email}, Filtered: {len(filtered)}")
            print(f"Response for {email} already exists")
            already_exists += 1
        else:
            data = {
                "email": email,
                "id_number": row["ID"],
                "station": row['Station'],
                "cgpa": float(row['CGPA']),
                "allotment_round": "Round 1",
                "year_and_sem": YEAR_AND_SEM,
                "preference": 1,
                "offshoot": 0,
                "offshoot_total": 0,
                "offshoot_type": "",
                "stipend": int(row['Stipend']),
            }  
            supabase.table(TABLE_NAME).insert(data).execute()
            success += 1
    except Exception as e:
        print("---------------")
        print(row)
        print(e)
        failed += 1

print("Success: ", success)
print("Failed: ", failed)
print("Already Exists: ", already_exists)