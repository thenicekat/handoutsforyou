"""
@author: Umaang Khambhati
@about: Convert prereqs.csv to prereqs.json
"""

import csv
import json
import os
import re

def main():
    csv_file_path = os.path.join(os.path.dirname(__file__), 'prereqs.csv')
    output_file_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'public', 'prereqs.json'))

    if not os.path.exists(csv_file_path):
        print(f"Error: '{csv_file_path}' not found. Please ensure it is in the scripts/ folder.")
        return

    courses = []
    
    encodings_to_try = ['utf-8-sig', 'cp1252', 'latin-1']
    
    file_content = None
    used_encoding = None

    for enc in encodings_to_try:
        try:
            with open(csv_file_path, 'r', encoding=enc) as f:
                file_content = list(csv.reader(f))
                used_encoding = enc
                print(f"Successfully read file using encoding: {enc}")
                break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Error reading with {enc}: {e}")
            break

    if file_content is None:
        print("Failed to read the CSV file with supported encodings.")
        return

    try:
        for row_idx, row in enumerate(file_content):
            if not row:
                continue

            def clean_cell(cell):
                s = str(cell)
                s = s.replace('\\n', ' ')
                s = s.replace('\n', ' ')
                s = s.replace('\r', ' ')
                s = re.sub(r'\s+', ' ', s)
                return s.strip()

            row = [clean_cell(cell) for cell in row]

            if len(row) < 3:
                continue

            course = {}
            
            course_name = f"{row[0]} {row[1]} {row[2]}"
            course['name'] = course_name
            
            prereqs_list = []
            
            chunk_start_index = 3
            
            while chunk_start_index < len(row):
                try:
                    if chunk_start_index >= len(row):
                        break
                        
                    p_subj = row[chunk_start_index]
                    
                    if not p_subj:
                        break

                    def get_col(offset):
                        idx = chunk_start_index + offset
                        return row[idx] if idx < len(row) else ""

                    p_num = get_col(1)
                    p_name = get_col(2)
                    p_type = get_col(3)
                    p_condition = get_col(4)

                    pre_req_obj = {}
                    pre_req_obj["prereq_name"] = f"{p_subj} {p_num} {p_name}"

                    pre_req_obj["pre_cop"] = p_type if p_type else "PRE"

                    cond_norm = (p_condition or "").strip().upper()
                    pre_req_obj["condition"] = cond_norm if cond_norm else "AND"

                    prereqs_list.append(pre_req_obj)

                except Exception as e:
                    print(f"Warning on row {row_idx+1} processing prereq: {e}")
                
                chunk_start_index += 5

            course['prereqs'] = prereqs_list

            if len(prereqs_list) > 0:
                conds = [p.get('condition', 'AND').upper() for p in prereqs_list]
                if 'OR' in conds:
                    course['all_one'] = 'One'
                elif all(c == 'AND' for c in conds):
                    course['all_one'] = 'All'

            special_codes = ('PHY F415', 'PHY F317', 'CHE F312', 'BIO F311')
            if any(course.get('name', '').startswith(code) for code in special_codes):
                if len(prereqs_list) >= 3:
                    conds = [p.get('condition', 'AND').upper() for p in prereqs_list]
                    
                    if conds[0] == 'AND' and 'OR' in conds[1:3]:
                        nested = {
                            "type": "AND",
                            "items": [
                                prereqs_list[0],
                                {"type": "OR", "items": prereqs_list[1:3]}
                            ]
                        }
                    elif conds[0] == 'OR' and conds[1] in ('AND', ''):
                        nested = {
                            "type": "AND",
                            "items": [
                                {"type": "OR", "items": prereqs_list[0:2]},
                                prereqs_list[2]
                            ]
                        }
                    else:
                        nested = {
                            "type": "AND",
                            "items": prereqs_list[0:3]
                        }
                    
                    course['prereqs_nested'] = nested
                    course.pop('all_one', None)
                else:
                    course['prereqs_nested'] = {"type": "AND", "items": prereqs_list}
            courses.append(course)

        with open(output_file_path, 'w', encoding='utf-8') as outfile:
            json.dump(courses, outfile, indent=4)
            
        print(f"Success! Converted {len(courses)} courses to {output_file_path}")

    except Exception as e:
        print(f"An unexpected error occurred during processing: {e}")

if __name__ == "__main__":
    main()