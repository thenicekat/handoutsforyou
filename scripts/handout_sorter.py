"""
18 19 Sem 2 Done
19 20 Sem 1 Done
19 20 Sem 2 Done
20 21 Sem 1 lite
20 21 Sem 2 lite
21 22 Sem 1 lite
21 22 Sem 2 lite
22 23 Sem 1 Done
22 23 Sem 2 Done
23 24 Sem 1
23 24 Sem 2
"""

import os

# list all possible files in the current directory recursively and store them in a list
handouts = {}

for root, dirs, filenames in os.walk("."):
    for filename in filenames:        
        # filter .doc, .docx, .pdf, .txt, .rtf files
        if filename.endswith(".doc") or filename.endswith(".docx") or filename.endswith(".pdf") or filename.endswith(".txt") or filename.endswith(".rtf"):
            path = os.path.join(root, filename)
            
            # if path has the string handout in upper or lower case, move it to the handout folder
            if "handout" in path.lower():
                # rename it to x and then move it to the handout folder
                name = path.split("/")[1]
                section = path.split("/")[2]
                new_name = name + "_HANDOUT." + filename.split(".")[-1]
                if new_name in handouts.keys():
                    handouts[new_name].append(path)
                else:
                    handouts[new_name] = [path]
                
for new_name in handouts.keys():
    if len(handouts[new_name]) > 1:
        # give option to the user to select one
        # print all the paths
        print("Select one of the following files:")
        for i, path in enumerate(handouts[new_name]):
            print(f"{i+1}. {path}")
        # take input
        choice = int(input("Enter your choice: "))
        
        # replace the array with the selected path
        handouts[new_name] = [handouts[new_name][choice-1]]
        
for new_name in handouts.keys():
    # modify the file name
    path = handouts[new_name][0]
    filename = path.split("/")[-1]
    os.rename(path, path.replace(filename, new_name)) 
    
    # move the file to the "handout" folder check if the file already exists
    if not os.path.exists(f"handout/{new_name}"):
        os.system(f"cp '{path.replace(filename, new_name)}' handout/")
        
    # revert the file name
    os.rename(path.replace(filename, new_name), path)