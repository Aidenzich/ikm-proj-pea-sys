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

df['tf_idf'] = df['tf_idf'].apply(lambda x: x.replace('[', '').replace(']', '').replace("'", ''))

df.to_csv(DATAPATH+'/result.csv', index=False)