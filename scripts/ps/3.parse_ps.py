"""
@author: Divyateja Pasupuleti
@about: Converts a csv file containing PS data into necessary format and pushes it to supabase
CSV Format: Email,Company,CGPA,Year-Semester,Preference
"""
import pandas as pd
import os
import os
from supabase import create_client, Client
import dotenv
from tqdm import tqdm

dotenv.load_dotenv(dotenv_path="./../../.env.local")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

# Constants
MASTER_FILE = 'ps1.csv'
TABLE_NAME = 'ps1_responses'
YEAR_AND_SEM = '2022 Batch'

# Read csv file
df = pd.read_csv(MASTER_FILE)
failed = 0
success = 0

for index, row in tqdm(df.iterrows()):
    try:
        data = {
            "email": row['Email Address'],
            "station": row['Station Name'],
            "cgpa": float(row['CGPA']),
            "allotment_round": "Round 1",
            "year_and_sem": YEAR_AND_SEM,
            "preference": 0
        }  
        supabase.table(TABLE_NAME).insert(data).execute()
        success += 1
    except Exception as e:
        # print("-----------------")
        # print(row)
        failed += 1

print("Success: ", success)
print("Failed: ", failed)