# Q: would lower interest rate improve the economy?

import pandas as pd
import numpy as np
import statsmodels.api as sm
# from sklearn.model_selection import train_test_split
from statsmodels.tsa.stattools import adfuller
from sklearn import linear_model
import matplotlib.pyplot as plt

data = pd.read_csv('Datasets/data.csv', index_col='date').dropna()

# y = data['gdp']
# X = data[['effr','gdp']]
# variables = data[['ys', 'cli', 'gdp', 'cpi', 'm2', 'effr', 'oil', 'u', 'ip']]
variables = data[['gdp', 'effr']]


# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5)
#
# model = linear_model.LinearRegression()
# reg = model.fit(X_train, y_train)
# series = read_csv('Datasets/daily-total-female-births.csv', header=0, index_col=0)
# X = series.values
# print(X.iloc[:,0])


def has_unit_root(X, sig=.05):
    """
    test if data has unit root (non-stationary) using ADF
    :param X: array 1d
    :param sig: float
    :return: boolean, true if it has unit root, false if it's stationary
    """
    adf = adfuller(X)
    pvalue = adf[1]
    # print(pvalue)
    if pvalue < sig:
        return False
    else:
        return True


def difference(ds, interval=1):
    """
    :param ds: array_like 1d, original data
    :param interval: int
    :return: array_like 1d, differencing at interval level data
    """
    diff = [None]
    ds = np.array(ds)
    for i in range(interval, len(ds)):
        value = ds[i] - ds[i - interval]
        diff.append(value)

    return diff


def time_series_stationay(variables):
    pd.options.mode.chained_assignment = None
    for variable in variables:
        if has_unit_root(variables[variable]):
            # variables[variable] = difference(variables[variable])
            variables.loc[:, variable] = difference(variables[variable])
    pd.options.mode.chained_assignment = 'warn'
    return variables


variables = time_series_stationay(variables)
lag = 2
X = variables['effr'].shift(-lag).dropna()
# y = variables['gdp'].dropna().tail((lag))
y = variables['gdp'].dropna()[:-lag]

X2 = sm.add_constant(X)
est = sm.OLS(y, X2)
est2 = est.fit()
print(est2.summary())

model = linear_model.LinearRegression()
X3 = pd.DataFrame(X)
# X_train, X_test, y_train, y_test = train_test_split(X3, y, test_size=0.2)
# model.fit(X_train, y_train)
model.fit(X3, y)
# y_pred = model.predict(X_test)
y_pred = model.predict(X3)
coefficients = model.coef_

plt.scatter(X3, y, color='black')
plt.plot(X3, y_pred, color='blue', linewidth=3)
plt.xticks(())
plt.yticks(())
plt.show()

"""
    Conclusion:
    -----------
    positive coefficient means the economy will go down (gpd decreases) if effr decreases
    effr is statistically significant at any significant level
    Therefore, lower interest rate will not improve the economy

"""
