document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'cqhbms9r01qm46d7fpkgcqhbms9r01qm46d7fpl0';
    const gainersList = document.getElementById('gainers-list');
    const losersList = document.getElementById('losers-list');

    async function fetchStockData() {
        try {
            const responseGainers = await fetch(`https://finnhub.io/api/v1/stock/top-gainers?token=${apiKey}`);
            const responseLosers = await fetch(`https://finnhub.io/api/v1/stock/top-losers?token=${apiKey}`);
            const gainers = await responseGainers.json();
            const losers = await responseLosers.json();

            displayData(gainers, gainersList);
            displayData(losers, losersList);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    function displayData(data, listElement) {
        listElement.innerHTML = '';
        data.forEach(stock => {
            const listItem = document.createElement('li');
            listItem.textContent = `${stock.ticker}: ${stock.name} - ${stock.change}%`;
            listElement.appendChild(listItem);
        });
    }

    fetchStockData();
});
