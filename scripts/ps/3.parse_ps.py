# This script converts a csv to custom json format
import pandas as pd
import json
import base64
import os
import os
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv(dotenv_path="./../../.env.local")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

# Constants
MASTER_FILE = 'PS1_master.csv'
TABLE_NAME = 'ps1'

# Read csv file
df = pd.read_csv(MASTER_FILE)
df['Company'] = df['Company'].apply(lambda x: x.strip())

# Create a dictionary of companies
companies = {}
final_data = []

# Go row by row and check if company already exists else create
for index, row in df.iterrows():
    if row['Company'] not in companies:
        companies[row['Company']] = {
            'name': row['Company'],
        }
    
    # Check if CGPA is NaN
    # If it is, skip
    if pd.isna(row['CGPA']):
        companies[row['Company']][row['Year-Semester']] = {
            'mincgpa': 0,
            'maxcgpa': 0,
            'students': set()
        }
    
    # Now check if the year is there in the company
    # If it's there update mincgpa and maxcgpa else create the year
    # Set float to 4 decinal places
    if row['Year-Semester'] not in companies[row['Company']]:
        try:
            companies[row['Company']][row['Year-Semester']] = {
                'mincgpa': float(row['CGPA']),
                'maxcgpa': float(row['CGPA']),
                'students': set()
            }
            # companies[row['Company']][row['Year-Semester']]['students'].add(base64.b64encode(row['ID Number'].encode('ascii')).decode('ascii'))
        except:
            print(f"Error in {row['Company']}||{row['Year-Semester']}||{row['CGPA']}||{row['ID Number']}")
            continue
    # If it is there, check if the cgpa is less than mincgpa or greater than maxcgpa
    else:
        try:
            if float(row['CGPA']) < companies[row['Company']][row['Year-Semester']]['mincgpa']:
                companies[row['Company']][row['Year-Semester']]['mincgpa'] = float(row['CGPA'])
            if float(row['CGPA']) > companies[row['Company']][row['Year-Semester']]['maxcgpa']:
                companies[row['Company']][row['Year-Semester']]['maxcgpa'] = float(row['CGPA'])
            # companies[row['Company']][row['Year-Semester']]['students'].add(base64.b64encode(row['ID Number'].encode('ascii')).decode('ascii'))
        except:
            print(f"Error in {row['Company']}||{row['Year-Semester']}||{row['CGPA']}||{row['ID Number']}")
            continue

for company in companies:      
    for year in companies[company]:
        if year == 'name':
            continue
        # push to supabase
        data = supabase.table(TABLE_NAME).insert({
            "name": company,
            "year": year,
            "min_cgpa": companies[company][year]['mincgpa'],
            "max_cgpa": companies[company][year]['maxcgpa'],
        }).execute()
        assert len(data.data) > 0