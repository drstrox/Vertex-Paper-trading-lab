document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'cqfir39r01qle0e3q9k0cqfir39r01qle0e3q9kg'; // Replace with your actual Finnhub API key

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

    setInterval(() => {
        Object.keys(stocks).forEach(stockId => {
            fetchStockData(stockId, stocks[stockId]);
        });
    }, 50000);

    document.querySelector('#searchInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            search();
        }
    });
});

function fetchStockData(stockId, symbol) {
    const apiKey = 'cqfir39r01qle0e3q9k0cqfir39r01qle0e3q9kg'; // Replace with your actual Finnhub API key
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
    const apiKey = 'cqfir39r01qle0e3q9k0cqfir39r01qle0e3q9kg'; // Replace with your actual Finnhub API key

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


function submitOrder(symbol) {
    const action = document.getElementById('order-action').value;
    const mode = document.getElementById('order-mode').value;
    const type = document.getElementById('order-type').value;
    const quantity = document.getElementById('quantity').value;
    const priceLimit = type === 'limit' ? document.getElementById('price-limit').value : null;

    if (!quantity) {
        alert("Please enter the quantity.");
        return;
    }

    if (type === 'limit' && !priceLimit) {
        alert("Please enter the price limit.");
        return;
    }

    const orderDetails = {
        symbol: symbol,
        action: action,
        mode: mode,
        type: type,
        quantity: quantity,
        priceLimit: priceLimit
    };

    fetch('/submit_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while submitting your order");
    });
}

async function fetchHeldStocks() {
    try {
        const response = await fetch('/held_stocks');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const heldStocks = await response.json();
        displayHeldStocks(heldStocks);
    } catch (error) {
        console.error('Error fetching held stocks:', error);
        document.getElementById('held-stocks-container').textContent = 'Error fetching held stocks.';
    }
}

function displayHeldStocks(heldStocks) {
    const container = document.getElementById('held-stocks-container');
    container.innerHTML = ''; // Clear any existing content

    if (Object.keys(heldStocks).length === 0) {
        container.textContent = 'No stocks currently held.';
        return;
    }

    const table = document.createElement('table');
    table.border = '1';

    const headerRow = document.createElement('tr');
    const symbolHeader = document.createElement('th');
    symbolHeader.textContent = 'Symbol';
    const quantityHeader = document.createElement('th');
    quantityHeader.textContent = 'Quantity';
    headerRow.appendChild(symbolHeader);
    headerRow.appendChild(quantityHeader);
    table.appendChild(headerRow);

    for (const [symbol, quantity] of Object.entries(heldStocks)) {
        const row = document.createElement('tr');
        const symbolCell = document.createElement('td');
        symbolCell.textContent = symbol;
        const quantityCell = document.createElement('td');
        quantityCell.textContent = quantity;
        row.appendChild(symbolCell);
        row.appendChild(quantityCell);
        table.appendChild(row);
    }

    container.appendChild(table);
}

// Fetch and display held stocks when the page loads
window.onload = fetchHeldStocks;
