import pdfplumber as pd
import re, json

pdf = r"C:\Users\Anirudh\Documents\21-22.pdf"
p = pd.open(pdf)
pages = p.pages[4:258]


# initialize variables
ls: list = []
finalDic: dict = {}
dic: dict = {}
cur: str = ""
curCom: str = ""

# loop thro the pages
for pag in pages:
    s = pag.extract_text().split("\n")[:-1]  # extract page text
    if len(pag.images) > 2:  # to check if the page is a cover page
        if finalDic.get(curCom):  # add existing company entries if available
            ls.append(dic)
            finalDic[curCom]["data"].extend(ls[1:])
            ls = []
        try:
            curCom = s[0]  # set current company
            finalDic[s[0]] = {
                re.split(":", s[1], 1)[0]: re.split(":", s[1], 1)[1],
                re.split(":", s[2], 1)[0]: re.split(":", s[2], 1)[1],
                re.split(":", s[3], 1)[0]: re.split(":", s[3], 1)[1],
                re.split(":", s[4], 1)[0]: re.split(":", s[4], 1)[1],
                re.split(":", s[5], 1)[0]: re.split(":", s[5], 1)[1],
                re.split(":", s[6], 1)[0]: re.split(":", s[6], 1)[1],
                "data": [],
            }
        except:
            print(pag.page_number)  # print page number for non uniform pages

    else:
        if len(s) != 0:  # ignore empty pages
            if len(re.split("Name:", s[0], 1)) > 1:  # check if page has new entry
                ls.append(dic)  # add previous entry and clear
                dic = {}
                cur = re.split("Name:", s[0], 1)[1]
                try:
                    dic[cur] = {
                        "CGPA": re.split("CGPA:", s[1], 1)[1],
                        "Role": re.split("Role:", s[2], 1)[1],
                        "Text": "\n".join(s[3:-1]),
                    }
                except:
                    print(
                        pag.page_number, s
                    )  # print page number for non uniform page needed to be handled manually
            else:
                dic[cur]["Text"] += "\n".join(
                    s[3:]
                )  # add to current entry if not a new entry

# add the final entry and list to finalDic
ls.append(dic)
finalDic[curCom]["data"].extend(ls[1:])

json.dump(finalDic, open("SI-21-22.json", "w"), indent=4)
