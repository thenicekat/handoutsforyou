# This script converts a csv to custom json format
import pandas as pd
import json

# Read csv file
df = pd.read_csv('mastersheet.csv')

companies = {}
final_data = []

# Go row by row and check if company already exists else create
for index, row in df.iterrows():
    if row['Company'] not in companies:
        companies[row['Company']] = {
            'name': row['Company'],
        }
    
    # Now check if the year is there in the company
    # If it's there update mincgpa and maxcgpa
    # Else create the year
    if row['Year-Semester'] not in companies[row['Company']]:
        companies[row['Company']][row['Year-Semester']] = {
            'mincgpa': row['CGPA'],
            'maxcgpa': row['CGPA'],
        }
    # If it is there, check if the cgpa is less than mincgpa or greater than maxcgpa
    else:
        if row['CGPA'] < companies[row['Company']][row['Year-Semester']]['mincgpa']:
            companies[row['Company']][row['Year-Semester']]['mincgpa'] = row['CGPA']
        if row['CGPA'] > companies[row['Company']][row['Year-Semester']]['maxcgpa']:
            companies[row['Company']][row['Year-Semester']]['maxcgpa'] = row['CGPA']
    
for company in companies:
    final_data.append(companies[company])
    
with open('../public/ps/ps2_data.json', 'w') as f:
    json.dump(final_data, f, indent=4)