# Our symbol
symbol = 'MSFT'

# importing the required module
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

# import requests
import requests
filename = '/mnt/c/Users/jaspe/Documents/GitHub/python/uglek-stocks/output.png'
api_key = 'FZFELEK09ZNZLAFT'
url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=1min&apikey=' + api_key
print(url)

url2 = 'https://newsapi.org/v2/everything?q=' + symbol + '&apiKey=2b4845edbf124109adb984648765398c'

data2 = requests.get(url2).json()
#print(data2)

# fetch stock data
r = requests.get(url)
data = r.json()
# get time series
ts = data['Time Series (1min)']
print(ts)
# get daily prices
y = [float(ts[d]['2. high']) for d in ts.keys()]
z = [float(ts[d]['3. low']) for d in ts.keys()]

# init array
x = range(len(y))

# plotting the points
plt.figure(figsize=(7,5))
plt.plot(x, y, label="High")
plt.plot(x, z, label="Low")
plt.legend()

# naming the x and y axis
plt.ylabel('Price')
plt.xlabel('Days')
# giving a title to my graph
plt.title(symbol)
# save to file
plt.savefig(filename)
