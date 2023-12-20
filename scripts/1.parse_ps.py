# This script converts a csv to custom json format
import pandas as pd
import json

# Read csv file
df = pd.read_csv('PS2_master.csv')
df['Company'] = df['Company'].apply(lambda x: x.strip())

# Create a dictionary of companies
companies = {}

# Create a list of final data which will be dumped to json read from json file
with open('../public/ps/ps2_data.json', 'r') as f:
    final_data = json.load(f)

# Add them to the dictionary
for item in final_data:
    companies[item['name']] = item

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
    # If it's there update mincgpa and maxcgpa
    # Else create the year
    if row['Year-Semester'] not in companies[row['Company']]:
        try:
            companies[row['Company']][row['Year-Semester']] = {
                'mincgpa': float(row['CGPA']),
                'maxcgpa': float(row['CGPA']),
                'students': set()
            }
            companies[row['Company']][row['Year-Semester']]['students'].add(row['ID Number'])
        except:
            print(f"Error in {row['Company']} {row['Year-Semester']} {row['CGPA']}")
            continue
    # If it is there, check if the cgpa is less than mincgpa or greater than maxcgpa
    else:
        try:
            if float(row['CGPA']) < companies[row['Company']][row['Year-Semester']]['mincgpa']:
                companies[row['Company']][row['Year-Semester']]['mincgpa'] = float(row['CGPA'])
            if float(row['CGPA']) > companies[row['Company']][row['Year-Semester']]['maxcgpa']:
                companies[row['Company']][row['Year-Semester']]['maxcgpa'] = float(row['CGPA'])
                
            companies[row['Company']][row['Year-Semester']]['students'].add(row['ID Number'])
        except:
            print(f"Error in {row['Company']} {row['Year-Semester']} {row['CGPA']}")
            continue

final_data = []
for company in companies:
    final_data.append(companies[company])

# Sort them based on name in lowercase
final_data.sort(key=lambda x: x['name'].lower())
    
with open('../public/ps/ps2_data.json', 'w') as f:
    json.dump(final_data, f, indent=4, default=list)