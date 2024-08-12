document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'cqi0fepr01qgbqu624i0cqi0fepr01qgbqu624ig'; // Replace with your actual Finnhub API key
    const stocks = {
        'sp500': 'AAPL',
        'dowjones': 'NVDA',
        'nasdaq': 'GOOGL',
        'a':'MSFT',
        'b':'META',
        'c':'AMZN',
        'd':'TSLA',
        'e':'WMT',
        'f':'BRK.B',
        'g':'AVGO',
        'h':'JPM',
        'i':'NVO',
        'j':'UNH',
        'k':'TCEHY',
        'l':'MA'
        
    };

    Object.keys(stocks).forEach(stockId => {
        fetchStockData(stockId, stocks[stockId]);
    });

    document.querySelector('#searchInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            search();
        }
    });
});

function fetchStockData(stockId, symbol) {
    const apiKey = 'cpv98ihr01qhmaus0ktgcpv98ihr01qhmaus0ku0'; // Replace with your actual Finnhub API key
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.c !== undefined && data.c !== 0) {
                document.querySelector(`#${stockId}-price`).textContent = `$${data.c}`;
                const change = ((data.c - data.pc) / data.pc * 100).toFixed(2);
                document.querySelector(`#${stockId}-change`).textContent = `${change}%`;
                document.querySelector(`#${stockId}-change`).style.color = change >= 0 ? 'green' : 'red';
            } else {
                document.querySelector(`#${stockId}-price`).textContent = `Price: $0 (Unable to fetch live price)`;
                document.querySelector(`#${stockId}-change`).textContent = `Change: N/A`;
                document.querySelector(`#${stockId}-change`).style.color = 'black';
            }
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

function search() {
    const query = document.querySelector('#searchInput').value;
    const apiKey = 'cpv98ihr01qhmaus0ktgcpv98ihr01qhmaus0ku0'; // Replace with your actual Finnhub API key

    fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.result && data.result.length > 0) {
                const symbol = data.result[0].symbol;
                fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.c !== undefined && data.c !== 0) {
                            const stockList = document.querySelector('#stockList');
                            const li = document.createElement('li');
                            li.innerHTML = `<a href="/stock/${symbol}">${symbol} - $${data.c}</a>`;
                            stockList.appendChild(li);
                        } else {
                            alert('Unable to fetch live price for the searched stock.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching stock data:', error);
                        alert('Error fetching stock data.');
                    });
            } else {
                alert('Stock not found!');
            }
        })
        .catch(error => console.error('Error fetching search data:', error));
}

function fetchStocks() {
    fetch('/stocks')
        .then(response => response.json())
        .then(data => {
            const stockList = document.getElementById('stock_List');
            stockList.innerHTML = '';
            data.forEach(stock => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="/stock/${stock[0]}">${stock[0]} - ${stock[1]}</a>`;
                stockList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching stocks:', error));
}

// Fetch stocks on page load
document.addEventListener('DOMContentLoaded', fetchStocks);
