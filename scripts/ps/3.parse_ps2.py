"""
@author: Divyateja Pasupuleti
@about: Converts a csv file containing PS data into necessary format and pushes it to supabase
PS2 CSV Format: Email,ID,AllotmentRound,Station,CGPA,PreferenceNumber,OffshootScore,OffshootTotal,OffshootType
"""
import pandas as pd
import os
import os
from supabase import create_client, Client
import dotenv
from tqdm import tqdm
import pathlib

ENV_PATH = pathlib.Path(__file__).parent.parent.parent / ".env.local"

assert (dotenv.load_dotenv(dotenv_path=ENV_PATH)), "Error loading .env file"

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(url, key)

# Constants
MASTER_FILE = pathlib.Path(__file__).parent / '24-25 Sem 1.csv'
TABLE_NAME = 'ps2_responses'
YEAR_AND_SEM = '24-25 Sem 1'

# Read csv file
df = pd.read_csv(MASTER_FILE)
failed = 0
success = 0

for index, row in tqdm(df.iterrows()):
    try:
        data = {
            "email": row['Email'],
            "id_number": row["ID"],
            "station": row['Station'],
            "cgpa": float(row['CGPA']),
            "allotment_round": str(row["AllotmentRound"]) if not pd.isna(row["AllotmentRound"]) else "Round 1",
            "year_and_sem": YEAR_AND_SEM,
            "preference": int(row["PreferenceNumber"]) if not pd.isna(row["PreferenceNumber"]) else 1,
            "offshoot": int(row["OffshootScore"]) if not pd.isna(row["OffshootScore"]) else 0,
            "offshoot_total": int(row["OffshootTotal"]) if not pd.isna(row["OffshootTotal"]) else 0,
            "offshoot_type": str(row["Type"]) if not pd.isna(row["Type"]) else "",
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