import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller


class TimeSeriesStationary:
    """
    Tranform time series data that eliminates unit root problems in data frame format
    """

    def __init__(self, data):
        self.data = data

    def has_unit_root(self, data_array, sig=.05):
        """
        test if data has unit root (non-stationary) using ADF
        :param data: array 1d
        :param sig: float, significant level
        :return: boolean, true if it has unit root, false if it's stationary
    difference
        """
        adf = adfuller(data_array)
        pvalue = adf[1]
        # print(pvalue)
        if pvalue < sig:
            return False
        else:
            return

    def log(self, data_array):
        """
        put variable into natural logarithm
        :param data: array_like 1d
        :return: array_like 1d, natural logarithm of the data set
        """
        for i in range(len(data_array)):
            data_array[i] = np.math.log(data_array[i])
        return data_array

    def difference(self, data_array, interval=1):
        """
        tranform data set at a certain difference level
        :param data_array: array_like 1d
        :param interval: int
        :return: array_like 1d, differencing at interval level data
        """
        diff = [None]
        data_array = np.array(data_array)
        for i in range(interval, len(data_array)):
            value = data_array[i] - data_array[i - interval]
            diff.append(value)

        return diff

    def time_series_stationary(self, data, lag_vars=[], lag=0):
        """
        :param data: array_like , original data
        :param lag_vars: array_like 1d, list all variables that need to be in lag form
        :return: array_like , data without unit root
        """
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
