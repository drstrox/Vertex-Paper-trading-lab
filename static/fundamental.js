document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const symbol = document.getElementById('symbolInput').value.toUpperCase();
    const apiKey = 'L60C4762R2G0N745'; // Replace with your Alpha Vantage API key

    fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Update UI with fetched data
            const fundamentalsDiv = document.getElementById('fundamentals');
            fundamentalsDiv.innerHTML = `
                <h2>${data.Name} (${data.Symbol})</h2>
                <p><strong>Exchange:</strong> ${data.Exchange}</p>
                <p><strong>Sector:</strong> ${data.Sector}</p>
                <p><strong>Industry:</strong> ${data.Industry}</p>
                <p><strong>Market Cap:</strong> ${data.MarketCapitalization}</p>
                <p><strong>EPS (TTM):</strong> ${data.EPS}</p>
                <p><strong>PE Ratio:</strong> ${data.PERatio}</p>
                <p><strong>Dividend Yield:</strong> ${data.DividendYield}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const fundamentalsDiv = document.getElementById('fundamentals');
            fundamentalsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
});
