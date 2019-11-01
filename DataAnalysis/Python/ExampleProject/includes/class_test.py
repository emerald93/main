# playing with data using Class

import pandas as pd
from sklearn import linear_model

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

# create a differenced series
# def difference2(dataset, interval=1):
#     diff = list();
#     dataset = np.array(dataset)
#
#     for row in range(interval, len(dataset)):
#         row_data = []
#         for col in range(int(count(X) / len(X))):
#             # print(str(row) + ":" + str(col))
#             value = dataset[row][col] - dataset[row - interval][col]
#             row_data.append(value)
#         diff.append(row_data)
#
#     return diff


def is_stationary(X, sig=.05):
    """
    Stationary test for multiple variables using Augmented Dickey-Fuller unit root test
    :param X: array_like, ist of variables
    :param sig: float, significant level
    :return: boolean, true if variable is Stationary, false if Non-stationay
    """
    adf_titles = ['tstat', 'pvalue', 'lags', 'nobs', 'critical value', 'icbest']
    adf_results = {}
    data_index = 0
    adf_mes2 = {}
    # print(X)

    for x in X:
        adf = adfuller(X.iloc[:, data_index])
        data_index = data_index + 1

        for i in range(len(adf_titles)):
            adf_results[adf_titles[i]] = adf[i]

        if adf_results['pvalue'] < sig:
            adf_mes = x + " is Stationary"
            adf_mes2[x] = True
        else:
            adf_mes = x + " is Non-stationary"
            adf_mes2[x] = False

        # print(adf_mes)

    return adf_mes2

# stationary_results = is_stationary(variables)
# for sr in stationary_results:
#     if stationary_results[sr]:
#         variables[sr] = variables[sr]
#     else:
#         variables[sr] = difference(variables[sr])
# variables = variables.dropna()
# name_columns = ['date','effr', 'gdp', 'u', 'nber', 'cpi', 'm2', 'oil', 'ip', 'ys', 'cli']
columns = ['gdp', 'effr', 'u']
data = DataCSV('data.csv')
X = data.get_x(columns)
y = data.get_y(columns)

model = linear_model.LinearRegression()

b0 = model.intercept_
b1 = model.coef_

print('gdp='+str(b0)+"+"+str(b1)+"effr")

