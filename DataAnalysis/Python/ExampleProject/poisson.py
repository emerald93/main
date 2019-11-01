import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from DataAnalysis.Python.ExampleProject.includes.time_series_stationary import TimeSeriesStationary

data = pd.read_csv('Datasets/data.csv', index_col='date').dropna()

quarters = []
for i in range(len(data['nber'])):
    count = 0
    if data['nber'][i] == 0:
        for value in data['nber'][i+1:]:
            count = count + 1
            if value == 1:
                break
    quarters.append(count)

data['quarters'] = quarters

variable_name = ['quarters', 'ys', 'cli', 'gdp', 'cpi', 'm2', 'effr', 'oil', 'u', 'ip']
variables = data[variable_name]
l_var = ['gdp', 'u', 'ip']

new_data = TimeSeriesStationary()
variables['oil'] = new_data.log(variables['oil'])
ts_data = new_data.time_series_stationary(variables, l_var, 2)

y = ts_data[variable_name[0]]
X = ts_data[variable_name[1:]]
model = sm.Poisson(y, X)
p_reg = model.fit()
print(p_reg.summary())

y_pred = p_reg.predict(X)

plt.scatter(X.index, y, color='black')
plt.scatter(X.index, y_pred, color='blue')
plt.xticks(())
plt.xlabel('Date')
plt.ylabel('Quarters')
plt.grid(True)
plt.show()
