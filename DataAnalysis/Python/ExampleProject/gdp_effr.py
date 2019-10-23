# Q: would lower interest rate improve the economy?

import pandas as pd
import statsmodels.api as sm

data = pd.read_csv('data.csv').dropna()

y = data['gdp']
X = data[['effr']]
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
#
# model = linear_model.LinearRegression()
# reg = model.fit(X_train, y_train)

# b_x =  model.coef_
# print('Coefficients:', b_x)
#
# b0 = model.intercept_
# print('Intercept: %.2f' % b0)
#
# y_pred = model.predict(X_test)
# var = r2_score(y_test, y_pred)
# print('Variance score: %.2f' % var)

X2 = sm.add_constant(X)
est = sm.OLS(y, X2)
est2 = est.fit()
print(est2.summary())

# Conclusion:
# positive coefficient means the economy will go down (gpd decreases) if effr decreases
# Howeever, effr is not statistically significant at any significant level
# Therefore, lower interest rate will not improve the economy

