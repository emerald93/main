import openpyxl as xl
# from openpyxl import load_workbook
import pandas as pd
# import matplotlib.pylot as plt
import numpy as np
from sklearn import linear_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
from sklearn.externals import joblib

data = pd.read_csv('data.csv').dropna()

# wb = load_workbook('data.xlsx')
# data = wb.data_only

print (data)