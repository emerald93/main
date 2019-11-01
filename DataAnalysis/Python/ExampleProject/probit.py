import pandas as pd
import matplotlib.pyplot as plt
# from johansen import coint_johansen
# import johansen
import statsmodels.api as sm
from statsmodels.tsa.vector_ar.vecm import coint_johansen
from DataAnalysis.Python.ExampleProject.includes.time_series_stationary import TimeSeriesStationary

data = pd.read_csv('Datasets/data.csv', index_col='date').dropna()

variable_name = ['nber', 'ys', 'cli', 'gdp', 'cpi', 'm2', 'effr', 'oil', 'u', 'ip']
variables = data[variable_name]
d_var = ['effr', 'oil', 'u', 'ip']
l_var = ['gdp', 'u', 'ip']

new_data = TimeSeriesStationary()
variables['oil'] = new_data.log(variables['oil'])
ts_data = new_data.time_series_stationary(variables, l_var, 2)

# cointegration = coint_johansen(ts_data, det_order=0, k_ar_diff=4)
# print(cointegration)
y = ts_data[variable_name[0]]
X = ts_data[variable_name[1:]]
model = sm.Probit(y, X)
probit_reg = model.fit()
print(probit_reg.summary())

coefficients = probit_reg.params
coef_pvalues = probit_reg.pvalues
coef_tvalues = probit_reg.tvalues

probit_R2 = probit_reg.prsquared
probit_log_likelihood = probit_reg.llf

probit_margeff = probit_reg.get_margeff(dummy=True,count=True)
p_me = probit_margeff.margeff
pme_tvalues = probit_margeff.tvalues
pme_pvalues = probit_margeff.pvalues
print(probit_margeff.summary())

y_pred = probit_reg.predict(X)

plt.bar(X.index, y, color='black')
plt.plot(X.index, y_pred, color='blue')
plt.axhline(y=0.5, color='r', linestyle='-')
plt.xlabel('Date')
plt.ylabel('Recession')
plt.grid(True)
plt.xticks(())
plt.show()
