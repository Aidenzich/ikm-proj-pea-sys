#%%
import pandas as pd
import os


ROOTPATH = os.path.abspath(os.path.join(
    os.path.abspath(__file__),
    os.pardir,
    os.pardir
))

DATAPATH = os.path.join(ROOTPATH, "data")
CSVPATH = os.path.join(DATAPATH, "result.csv")
df = pd.read_csv(CSVPATH)

for c in df.columns.tolist():
    if df[c].dtype == "object" and c != 'description':
        df[c] = df[c].apply(lambda x: x.replace('[', '').replace(']', '').replace("'", ''))


df['description'] = df['description'].apply(lambda x: x.replace(''))

# import re
# r = re.compile(r"\x28[^\x29]+\x29")
# print(df.columns.tolist())
# df['name'] = df['name'].apply(lambda x: r.sub("", x))

df.to_csv(DATAPATH+'/result.csv', index=False)
# %%
