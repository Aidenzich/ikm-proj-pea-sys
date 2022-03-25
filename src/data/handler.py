#%%
import pandas as pd
import os
import re
import json
from pathlib import Path
pd.options.mode.chained_assignment = None 

ROOT_PATH = Path(__file__).parent.parent
DATA_PATH = ROOT_PATH / 'data'



DATAPATH = os.path.join(ROOT_PATH, "data")


def init_count_years(total_years: list):
    count_years = {}
    for y in total_years:
        count_years[y] = 0
    return count_years


def cleanAndSaveJson(filename):
    filepath = DATA_PATH / filename
    df = pd.read_csv(filepath)
    for c in df.columns.tolist():
        if df[c].dtype == "object" and c != 'description':
            df[c] = df[c].apply(lambda x: str(x).replace('[', '').replace(']', '').replace("'", ''))

    df['description'] = df['description'].apply(lambda x: str(x).replace('_x000D_', ''))


    df.to_csv(filepath, index=False)
    df.fillna(" ", inplace=True)

    df = df[pd.to_numeric(df['year'], errors='coerce').notnull()]
    df['year'] = pd.to_numeric(df['year'])
    df['year_end'] = pd.to_numeric(df['year_end'])    
    df.sort_values(by=['label'], ascending=False, inplace=True)

    label_data = []
    proj_data = []
    display_order = 0

    label_list = df['label'].unique().tolist()
    # label_list = sorted(label_list, key= lambda x: str(x).isnumeric())

    TOTAL_YEARS = df.year.value_counts().sort_index().index.tolist()
    proj_id = 0
    
    # 類別分類
    for main_id, l in enumerate(label_list):
        display_order+=1
        label_df = df[df['label']==l]    
        year_list = label_df['year'].unique()
        project_id = f"main_{main_id}"
        
        count_years = init_count_years(TOTAL_YEARS)

        temp_year_count = dict(label_df['year'].value_counts().sort_index())
        
        # 取出該類別計畫各年份比數計算
        for y in temp_year_count.keys():        
            count_years[int(y)] = int(temp_year_count[y])

        l_json = {
            "start":int(min(year_list)),
            "end":int(max(year_list))+1,
            "name":l,
            "id": project_id,
            "displayOrder": display_order,        
            "series": list(count_years.values())
        }

        label_data.append(l_json)
        label_df.sort_values(by=['year'], inplace=True)

        # 建立regular expression 移除 (?/4) 字串的compile
        r = re.compile(r"\x28[^\x29]+\x29")

        # 以 'proj_name' 欄位儲存移除pattern後的計畫名稱
        label_df['proj_name'] = label_df['name'].apply(lambda x: r.sub('', x))
        label_projs = label_df['proj_name'].unique().tolist() # 取得不重複之計畫名稱
        
        for lp in label_projs:
            lp_df = label_df[label_df['proj_name'] == lp] # 以
            for _, row in lp_df.iterrows():
                display_order +=1
                proj_id+=1
                p_json = {
                    "start": int(row['year']),
                    "end": int(row['year']) +1,
                    "name":row['name'],
                    "id":f"proj_{proj_id}",
                    "displayOrder":int(display_order),
                    "project": project_id,
                    "keyword": row['keyword'] if (row['keyword'] and row['keyword'].strip())  else "無",
                    "ner": row['ner'] if (row['ner'] and row['ner'].strip()) else "無",
                    "tf_idf": row['tf_idf'] if (row['tf_idf'] and row['tf_idf'].strip()) else "無",
                    "desp": row['description'] if (row['description'] and row['description'].strip()) else "無",
                }
                proj_data.append(p_json)
    


    l_jsonString = json.dumps(label_data)
    p_jsonString = json.dumps(proj_data)

    with open(os.path.join(DATAPATH, f"main_{filename.replace('.csv', '')}.json"), "w") as jf:
        jf.write(l_jsonString)
    with open(os.path.join(DATAPATH, f"proj_{filename.replace('.csv', '')}.json"), "w") as jf:
        jf.write(p_jsonString)

def cleanAndSaveJsonWithOrder(filename):
    filepath = DATA_PATH / filename
    df = pd.read_csv(filepath)
    for c in df.columns.tolist():
        if df[c].dtype == "object" and c != 'description':
            df[c] = df[c].apply(lambda x: str(x).replace('[', '').replace(']', '').replace("'", ''))

    df['description'] = df['description'].apply(lambda x: str(x).replace('_x000D_', ''))

    df.to_csv(filepath, index=False)
    df.fillna(" ", inplace=True)

    df = df[pd.to_numeric(df['year'], errors='coerce').notnull()]
    df['year'] = pd.to_numeric(df['year'])
    df['year_end'] = pd.to_numeric(df['year_end'])    
    df.sort_values(by=['label'], ascending=False, inplace=True)

    label_data = []
    proj_data = []

    label_list = df['label'].unique().tolist()
    
    # label_list = sorted(label_list, key= lambda x: str(x).isnumeric())

    TOTAL_YEARS = df.year.value_counts().sort_index().index.tolist()
    proj_id = 0    
    

    # 類別資料
    for main_id, l in enumerate(label_list):        
        label_df = df[df['label']==l]    
        year_list = label_df['year'].unique()
        project_id = f"main_{main_id}"
        label_order = label_df['order'].min() - 1

        count_years = init_count_years(TOTAL_YEARS)

        temp_year_count = dict(label_df['year'].value_counts().sort_index())
        
        # 取出該類別計畫各年份比數計算
        for y in temp_year_count.keys():        
            count_years[int(y)] = int(temp_year_count[y])

        l_json = {
            "start":int(min(year_list)),
            "end":int(max(year_list)),
            "name":l,
            "id": project_id,
            "displayOrder": label_order,
            "series": list(count_years.values())
        }

        label_data.append(l_json)
        label_df.sort_values(by=['year'], inplace=True)
        
        # 建立regular expression 移除 (?/4) 字串的compile
        r = re.compile(r"\x28[^\x29]+\x29")

                                                    
        for _, row in label_df.iterrows():
            proj_id+=1
            p_json = {
                "start": int(row['year_start']),
                "end": int(row['year_end']) if int(row['year_end']) < 110 else int(row['year_end']) + 1,
                "name":row['name'],
                "id":f"proj_{proj_id}",
                "displayOrder":int(row['order']),
                "project": project_id,
                "keyword": row['keyword'] if (row['keyword'] and row['keyword'].strip())  else "無",
                "ner": row['ner'] if (row['ner'] and row['ner'].strip()) else "無",
                "tf_idf": row['tf_idf'] if (row['tf_idf'] and row['tf_idf'].strip()) else "無",
                "desp": row['description'] if (row['description'] and row['description'].strip()) else "無",
            }
            proj_data.append(p_json)
        
    label_data = sorted(label_data, key=lambda x: x['displayOrder'])
    l_jsonString = json.dumps(label_data)
    p_jsonString = json.dumps(proj_data)

    with open(os.path.join(DATAPATH, f"main_{filename.replace('.csv', '')}.json"), "w") as jf:
        jf.write(l_jsonString)
    with open(os.path.join(DATAPATH, f"proj_{filename.replace('.csv', '')}.json"), "w") as jf:
        jf.write(p_jsonString)




if __name__ == '__main__':
    # cleanAndSaveJson('result20.csv')
    # cleanAndSaveJson('result30.csv')
    # cleanAndSaveJsonWithOrder('final40.csv')
    # cleanAndSaveJsonWithOrder('final20.csv')
    # cleanAndSaveJsonWithOrder('final30.csv')
    cleanAndSaveJsonWithOrder('revise_length_20.csv')
    cleanAndSaveJsonWithOrder('revise_length_30.csv')
    cleanAndSaveJsonWithOrder('revise_length_40.csv')