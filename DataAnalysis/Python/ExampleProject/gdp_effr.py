# Q: would lower interest rate improve the economy?

import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from sklearn import linear_model


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


def is_stationary(X, sig=.05):
    """
        Stationary test for multiple variables using Augmented Dickey-Fuller unit root test

        Parameters
        ----------
        X: array_like
            list of variables
        sig: float
            significant level

        Returns
        -------
        variable is Stationary or Non-stationay
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


def difference(ds, interval=1):
    """
    :param ds: array_like 1d, original data
    :param interval: int
    :return: array_like 1d, differencing at interval level data
    """
    diff = list()
    diff.append(None)
    ds = np.array(ds)

    for i in range(interval, len(ds)):
        value = ds[i] - ds[i - interval]
        diff.append(value)
    return diff


stationary_results = is_stationary(variables)
for sr in stationary_results:
    if stationary_results[sr]:
        variables[sr] = variables[sr]
    else:
        variables[sr] = difference(variables[sr])
variables = variables.dropna()

lag = 2
X = variables['effr'].shift(lag).dropna()
y = variables['gdp'].tail(-lag)

X2 = sm.add_constant(X)
est = sm.OLS(y, X2)
est2 = est.fit()
print(est2.summary())

"""
    Conclusion:
    -----------
    positive coefficient means the economy will go down (gpd decreases) if effr decreases
    effr is statistically significant at any significant level
    Therefore, lower interest rate will not improve the economy

"""


