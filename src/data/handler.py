#%%
import pandas as pd
import os
import re
import json
from pathlib import Path
pd.options.mode.chained_assignment = None 

ROOT_PATH = Path(__file__).parent.parent
DATA_PATH = ROOT_PATH / 'data'

def init_count_years(total_years: list):
    count_years = {}
    for y in total_years:
        count_years[y] = 0
    return count_years

def cleanAndSaveJsonWithOrder(filename):
    with open(DATA_PATH / "statistic.json") as file:    
        count_data = json.load(file)    
    
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


    df.sort_values( by=['num_label'], inplace=True)
    label_list = df['num_label'].unique().tolist()
    label_name_list = df['label'].unique().tolist()
    print(label_list)
    print(label_name_list)
    category_num = int(re.search(r'\d+', filename).group())
    TOTAL_YEARS = df.year.value_counts().sort_index().index.tolist()
    proj_id = 0    
    

    # 類別資料
    for idx, l in enumerate(label_list):        
        label_df = df[df['num_label']==l]    
        year_list = label_df['year'].unique()
        project_id = f"main_{l}"
        label_order = label_df['order'].min() - 1
        # count_years = init_count_years(TOTAL_YEARS)
        # temp_year_count = dict(label_df['year'].value_counts().sort_index())
        
        # 取出該類別計畫各年份比數計算
        # for y in temp_year_count.keys():        
        #     count_years[int(y)] = int(temp_year_count[y])
        print(label_name_list)
        
        l_json = {
            "start":int(min(year_list)),
            "end": 110,
            "name": label_name_list[idx],
            "id": project_id,
            "displayOrder": label_order,
            "series": count_data[str(category_num)][str(l)]
        }
        print(count_data[str(category_num)][str(l)])
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

    with open(DATA_PATH / f"main_{filename.replace('.csv', '')}.json", "w") as jf:
        jf.write(l_jsonString)
    with open(DATA_PATH / f"proj_{filename.replace('.csv', '')}.json", "w") as jf:
        jf.write(p_jsonString)




if __name__ == '__main__':
    cleanAndSaveJsonWithOrder('revise_length_10.csv')
    cleanAndSaveJsonWithOrder('revise_length_20.csv')    
    cleanAndSaveJsonWithOrder('revise_length_30.csv')
    cleanAndSaveJsonWithOrder('revise_length_40.csv')
    cleanAndSaveJsonWithOrder('revise_length_50.csv')