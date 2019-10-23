# playing with data using Class

import pandas as pd
from sklearn import datasets, linear_model

# return dependent and independent variables from csv file
class DataCSV:
    def __init__(self, file_name):
        self.data = pd.read_csv(file_name).dropna()

    def get_x(self, name_columns):
        x = []
        for name_column in name_columns[1:]:
            x.append(self.data[name_column])
        X = [self.data[name_columns[1:]]]
        return X

    def get_y(self, name_columns):
        y = [self.data[name_columns[0]]]
        return y


# name_columns = ['date','effr', 'gdp', 'u', 'nber', 'cpi', 'm2', 'oil', 'ip', 'ys', 'cli']
columns = ['gdp', 'effr', 'u']
data = DataCSV('data.csv')
X = data.get_x(columns)
y = data.get_y(columns)

model = linear_model.LinearRegression()

