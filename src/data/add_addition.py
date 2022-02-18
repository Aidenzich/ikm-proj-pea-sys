#%%
from operator import index
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
CSVPATH2 = os.path.join(DATAPATH, "nar_output.csv")
df = pd.read_csv(CSVPATH)
df2 = pd.read_csv(CSVPATH2)




# %%
df2['關鍵詞'] = df2['關鍵詞'].apply(lambda x: x.replace('[', '').replace(']', '').replace("'", ''))
df2['NER'] = df2['NER'].apply(lambda x: x.replace('[', '').replace(']', '').replace("'", ''))

df2

#%%

df.rename(columns={
    '計畫完整中文名稱': 'name', 
    '年度':'year'
}, inplace=True)
print(df)

#%%

df2.rename(columns={
    '計畫名稱':'name',
    '關鍵詞':'keyword',
    'NER':'ner'
}, inplace=True)
df2
#%%
result = df.merge(df2, how='left', on='name')
# df.merge(df2, by=)
result.fillna('', inplace=True)
result

result.drop(columns=['class'], inplace=True)

#%%
result

result.to_csv('result.csv', index=False)