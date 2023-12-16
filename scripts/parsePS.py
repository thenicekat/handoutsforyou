# This script converts a csv to custom json format
import pandas as pd
import json

# Read csv file
df = pd.read_csv('PS1_master.csv')

companies = {}
final_data = []

# Convert all Year-Semester from 23-24 2 to 23-34 Sem 2 format
# for index, row in df.iterrows():
#     temp = row['Year-Semester']
#     df.at[index, 'Year-Semester'] = temp.split(' ')[0] + ' Sem ' + temp.split(' ')[1]

# print(df.head())

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
        }
        continue
    
    # Now check if the year is there in the company
    # If it's there update mincgpa and maxcgpa
    # Else create the year
    if row['Year-Semester'] not in companies[row['Company']]:
        companies[row['Company']][row['Year-Semester']] = {
            'mincgpa': float(row['CGPA']),
            'maxcgpa': float(row['CGPA']),
        }
    # If it is there, check if the cgpa is less than mincgpa or greater than maxcgpa
    else:
        if float(row['CGPA']) < companies[row['Company']][row['Year-Semester']]['mincgpa']:
            companies[row['Company']][row['Year-Semester']]['mincgpa'] = float(row['CGPA'])
        if float(row['CGPA']) > companies[row['Company']][row['Year-Semester']]['maxcgpa']:
            companies[row['Company']][row['Year-Semester']]['maxcgpa'] = float(row['CGPA'])
    
for company in companies:
    final_data.append(companies[company])

# Sort them based on mincgpa from highest to lowest using 23-24 2 as the key
final_data.sort(key=lambda x: x['2021 Batch']['mincgpa'], reverse=True)
    
with open('../public/ps/ps1_data.json', 'w') as f:
    json.dump(final_data, f, indent=4)