import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller


class TimeSeriesStationary:
    """
    has_unit_root
    -------------
        test if data has unit root (non-stationary) using ADF
        :param data: array 1d
        :param sig: float, significant level
        :return: boolean, true if it has unit root, false if it's stationary
    difference
    -----------
        :param data: array_like 1d
        :param interval: int
        :return: array_like 1d, differencing at interval level data
    time_series_stationary
    ---------------------
        :param data: array_like , original data
        :return: array_like 1d, data without unit roottime_series_stationary
    lags
    ---------------------
        :param data: array_like , original data
        :param lag: int , number of lags
        :return: array_like 1d, data without unit root
    """

    def __init__(self):
        self

    def has_unit_root(self, data_array, sig=.05):
        adf = adfuller(data_array)
        pvalue = adf[1]
        # print(pvalue)
        if pvalue < sig:
            return False
        else:
            return True

    def difference(self, data_array, interval=1):
        diff = [None]
        data_array = np.array(data_array)
        for i in range(interval, len(data_array)):
            value = data_array[i] - data_array[i - interval]
            diff.append(value)

        return diff

    def time_series_stationary(self, data, lag_vars=[], lag=0):
        pd.options.mode.chained_assignment = None
        for variable in data:
            if self.has_unit_root(data[variable]):
                # data[variable] = self.difference(data[variable])
                data.loc[:, variable] = self.difference(data[variable])
            if lag:
                if variable in lag_vars:
                    lag_data = data[variable].shift(-lag)
                    data.loc[:, variable] = lag_data
        pd.options.mode.chained_assignment = 'warn'
        return data.dropna()
