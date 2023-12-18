"""
@author: Saphereye
@about: Expects the input as output from similar_names_filter.py. Uses the grouped names and consolidates their data together and creates a new file.
"""
import json

FILTERED_FILE = 'soundex_filter.txt'
JSON_FILE = '../public/ps/ps1_data.json'
OUTPUT_FILE = 'final.json'

# Getting the original file data for cg data
with open(JSON_FILE, 'r') as f:
    json_data = json.load(f)

# Getting the grouped names data
with open(FILTERED_FILE, 'r') as f:
    filtered_data = [item.strip().split(',') for item in f.readlines()]

output_json = []

for group in filtered_data:
    # Taking first element as station name in json
    main_name = group[0]

    max_num = -1
    min_num = 11

    for item in json_data:
        if item['name'] in group:
            # BUG FIX: 2021 Batch might not exist
            max_num = max(max_num, item["2021 Batch"]["maxcgpa"])
            min_num = min(min_num, item["2021 Batch"]["mincgpa"])
    output_json.append({"name": main_name, "2021 Batch": {"maxcgpa": max_num, "mincgpa": min_num}})

with open(OUTPUT_FILE, 'w') as f:
    json.dump(output_json, f, indent=4)