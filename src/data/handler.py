#%%
import pandas as pd
import os
import json
import numpy as np
from natsort import index_natsorted

ROOTPATH = os.path.abspath(os.path.join(
    os.path.abspath(__file__),
    os.pardir,
    os.pardir
))

DATAPATH = os.path.join(ROOTPATH, "data")
CSVPATH = os.path.join(DATAPATH, "d1.csv")
df = pd.read_csv(CSVPATH)

df = df[pd.to_numeric(df['年度'], errors='coerce').notnull()]
df['年度'] = pd.to_numeric(df['年度'])

df.sort_values(by=['label'], ascending=False, inplace=True)

label_data = []
proj_data = []
display_order = 0

label_list = df['label'].unique()
label_list = sorted(label_list, key= lambda x: str(x).isnumeric())
for idx, l in enumerate(label_list):
    display_order+=1
    label_df = df[df['label']==l]    
    year_list = label_df['年度'].unique()
    temp_id = f"main_{idx}"
    l_json = {
        "start":int(min(year_list)),
        "end":int(max(year_list)),
        "name":l,
        "id": temp_id,
        "displayOrder": display_order
    }
    label_data.append(l_json)
    # project_df = label_df['計畫完整中文名稱']
    # print(label_df)
    label_df.sort_values(by=['年度'], inplace=True)
    for idx2, (_, row) in enumerate(label_df.iterrows()):
        display_order+=1
        
        p_json = {
            "start": int(row['年度']),
            "end": int(row['年度'])+1,
            "name":row['計畫完整中文名稱'],
            "id":f"proj_{idx2}",
            "displayOrder":int(display_order),
            "project": temp_id
        }
        proj_data.append(p_json)

l_jsonString = json.dumps(label_data)
p_jsonString = json.dumps(proj_data)

with open(os.path.join(DATAPATH, "main.json"), "w") as jf:
    jf.write(l_jsonString)
with open(os.path.join(DATAPATH, "proj.json"), "w") as jf:
    jf.write(p_jsonString)
    # for idx, n in enumerate(label_df):
        # print(n)
        # n_json = {
        #     "start":min(year_list),
        #     "end":max(year_list),
        #     "name":n,
        #     "id": f"main_{idx}",
        #     "displayOrder": display_order
        # }

# print(label_data)
# print(df['年度'].value_counts())
# %%

# %%
