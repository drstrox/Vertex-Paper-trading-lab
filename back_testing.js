document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = parseCSV(text);
        runBacktest(data);
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const rows = text.split('\n');
    return rows.map(row => {
        const cols = row.split(',');
        return {
            date: cols[0],
            open: parseFloat(cols[1]),
            high: parseFloat(cols[2]),
            low: parseFloat(cols[3]),
            close: parseFloat(cols[4]),
            volume: parseFloat(cols[5])
        };
    });
}

function runBacktest(data) {
    // Example strategy: Buy if the close price is higher than the open price
    let profit = 0;
    let returns = [];
    for (let i = 1; i < data.length; i++) {
        if (data[i].close > data[i].open) {
            profit += data[i].close - data[i].open;
            returns.push((data[i].close - data[i].open) / data[i].open);
        }
    }

    const sharpeRatio = calculateSharpeRatio(returns);
    document.getElementById('profit').innerText = `Total Profit: ${profit.toFixed(2)}`;
    document.getElementById('sharpeRatio').innerText = `Sharpe Ratio: ${sharpeRatio.toFixed(2)}`;
}

function calculateSharpeRatio(returns) {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.map(r => Math.pow(r - mean, 2)).reduce((a, b) => a + b, 0) / returns.length);
    return mean / stdDev;
}
