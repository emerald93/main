import pandas as pd
import statsmodels.api as sm
from sklearn import linear_model
import matplotlib.pyplot as plt
from DataAnalysis.Python.ExampleProject.includes.time_series_stationary import TimeSeriesStationary

data = pd.read_csv('Datasets/data.csv', index_col='date').dropna()
variables = data[['gdp', 'effr']]
print(variables)
ts_data = TimeSeriesStationary().time_series_stationary(variables, ['effr'], 2)

X = ts_data['effr']
y = ts_data['gdp']
X2 = sm.add_constant(X)
est = sm.OLS(y, X2)
est2 = est.fit()
print(est2.summary())

model = linear_model.LinearRegression()
X3 = pd.DataFrame(X)
model.fit(X3, y)
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