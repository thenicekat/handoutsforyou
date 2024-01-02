"""
@author: Divyateja Pasupuleti
@about: Convert prereqs.csv to prereqs.json
"""

import math
import pandas as pd

# Read in the data
df = pd.read_csv('./prereqs.csv', encoding='utf-8')

courses = []

for row in df.values:
    course = {}
    
    course_name  = row[0] + ' ' + row[1] + ' ' + row[2]
    course['name'] = course_name
    
    prereqs = []
    for i in range(0, len(row) - 3, 5):
        pre_req = {}
        try:
            if math.isnan(row[i + 3]):
                pass
            else:
                pre_req["prereq_name"]  = str(row[i + 3]).strip() + ' ' + str(row[i + 4]).strip() + ' ' + str(row[i + 5]).strip()
                pre_req["PRE/COP"] = str(row[i + 6]).strip()
                if str(row[i + 7]).strip().lower() == "and":
                    course["All/One"] = "All"
                elif str(row[i + 7]).strip().lower() == "or":
                    course["All/One"] = "One"
                prereqs.append(pre_req)
        except:
            pre_req["prereq_name"]  = str(row[i + 3]).strip() + ' ' + str(row[i + 4]).strip() + ' ' + str(row[i + 5]).strip()
            pre_req["PRE/COP"] = str(row[i + 6]).strip()
            if str(row[i + 7]).strip().lower() == "and":
                    course["All/One"] = "All"
            elif str(row[i + 7]).strip().lower() == "or":
                course["All/One"] = "One"
            prereqs.append(pre_req)
            
    course['prereqs'] = prereqs
    courses.append(course)

    
# Write to json with pretty formatting
import json

with open('prereqs.json', 'w') as outfile:
    json.dump(courses, outfile, indent=4)