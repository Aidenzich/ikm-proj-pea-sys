#%%
from turtle import Turtle
import pandas as pd
import os
import json
import numpy as np
from natsort import index_natsorted
import re

ROOTPATH = os.path.abspath(os.path.join(
    os.path.abspath(__file__),
    os.pardir,
    os.pardir
))

DATAPATH = os.path.join(ROOTPATH, "data")
CSVPATH = os.path.join(DATAPATH, "result.csv")
df = pd.read_csv(CSVPATH)
df.fillna(" ", inplace=True)
# print(df)
# exit()
df = df[pd.to_numeric(df['year'], errors='coerce').notnull()]
df['year'] = pd.to_numeric(df['year'])

df.sort_values(by=['label'], ascending=False, inplace=True)

label_data = []
proj_data = []
display_order = 0

label_list = df['label'].unique()
label_list = sorted(label_list, key= lambda x: str(x).isnumeric())
for idx, l in enumerate(label_list):
    display_order+=1
    label_df = df[df['label']==l]    
    year_list = label_df['year'].unique()
    temp_id = f"main_{idx}"    
    l_json = {
        "start":int(min(year_list)),
        "end":int(max(year_list)),
        "name":l,
        "id": temp_id,
        "displayOrder": display_order,        
        "series": label_df['year'].value_counts().sort_index().tolist()
    }

    label_data.append(l_json)
    # project_df = label_df['name']
    # print(label_df)
    label_df.sort_values(by=['year'], inplace=True)
    for idx2, (_, row) in enumerate(label_df.iterrows()):
        display_order+=1
        row['name'] = str(row["year"])+ "年度  - " + row['name']
        p_json = {
            "start": int(row['year']),
            "end": int(row['year'])+1,
            "name":row['name'],
            "id":f"proj_{idx2}",
            "displayOrder":int(display_order),
            "project": temp_id,
            "keyword": row['keyword'] if (row['keyword'] and row['keyword'].strip())  else "無",
            "ner":   row['ner'] if (row['ner'] and row['ner'].strip()) else "無",
            "tf_idf":   row['tf_idf'] if (row['tf_idf'] and row['tf_idf'].strip()) else "無",
        }
        proj_data.append(p_json)

l_jsonString = json.dumps(label_data)
p_jsonString = json.dumps(proj_data)

with open(os.path.join(DATAPATH, "main.json"), "w") as jf:
    jf.write(l_jsonString)
with open(os.path.join(DATAPATH, "proj.json"), "w") as jf:
    jf.write(p_jsonString)

