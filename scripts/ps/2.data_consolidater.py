"""
@author: Saphereye
@about: Expects the input as output from similar_names_filter.py. Uses the grouped names and consolidates their data together and creates a new file.
"""
import pandas as pd

FILTERED_FILE = 'soundex_filter.txt'
CSV_FILE = 'PS2_master.csv'
OUTPUT_FILE = 'final.csv'

# Getting the original file data for cg data
df = pd.read_csv(CSV_FILE)

# Getting the grouped names data
with open(FILTERED_FILE, 'r') as f:
    filtered_data = [item.strip().split('<|>') for item in f.readlines()]
    
# Creating a new dataframe with the filtered data
for entry in filtered_data:
    representation_name = entry[0]
    for name in entry[1:]:
        df.loc[df['Company'] == name, 'Company'] = representation_name

# Writing the output to output csv
df.to_csv(OUTPUT_FILE, index=False)
