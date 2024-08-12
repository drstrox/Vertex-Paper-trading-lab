console.log('stock_details.js loaded');

import { auth, db, onAuthStateChanged, doc, updateDoc,getDoc } from './aboutusscript.js';
import { arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Import arrayUnion directly from Firestore




document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // fetchLivePrice('{{ stock[1] }}');

    document.getElementById('order-type').addEventListener('change', (event) => {
        const priceLimitSection = document.getElementById('price-limit-section');
        if (event.target.value === 'limit') {
            priceLimitSection.style.display = 'block';
        } else {
            priceLimitSection.style.display = 'none';
        }
    });

    window.submitOrder = submitOrder;
    console.log('submitOrder function defined globally');
});

function fetchLivePrice(symbol) {
    console.log('fetchLivePrice called with symbol:', symbol);
    const apiKey = 'cqfir39r01qle0e3q9k0cqfir39r01qle0e3q9kg'; // Replace with your actual Finnhub API key
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.c !== undefined && data.c !== 0) {
                const priceElement = document.getElementById('price');
                const changeElement = document.getElementById('change');

                if (priceElement && changeElement) {
                    priceElement.textContent = `Price: $${data.c}`;
                    const change = ((data.c - data.pc) / data.pc * 100).toFixed(2);
                    changeElement.textContent = `Change: ${change}%`;
                    changeElement.style.color = change >= 0 ? 'green' : 'red';
                }

                return data.c; // Return the current price
            } else {
                throw new Error('Unable to fetch live price');
            }
        })
        .catch(error => {
            console.error('Error fetching live price:', error);

            const priceElement = document.getElementById('price');
            const changeElement = document.getElementById('change');

            if (priceElement && changeElement) {
                priceElement.textContent = `Price: $0 (Error fetching price)`;
                changeElement.textContent = `Change: N/A`;
                changeElement.style.color = 'black';
            }

            throw error; // Rethrow error to handle it in submitOrder
        });
}



function submitOrder(stockId, stockSymbol, stockName) {
    console.log('submitOrder called with stockId:', stockId);
    const action = document.getElementById('order-action').value; // 'buy' or 'sell'
    const mode = document.getElementById('order-mode').value;
    const type = document.getElementById('order-type').value;
    const quantity = parseInt(document.getElementById('quantity').value); // Ensure quantity is an integer
    const priceLimit = type === 'limit' ? parseFloat(document.getElementById('price-limit').value) : null;

    fetchLivePrice(stockSymbol).then(async (livePrice) => {
        const orderDetails = {
            stockId: stockId,
            stockName: stockName,
            stockSymbol: stockSymbol,
            action: action,
            mode: mode,
            type: type,
            quantity: quantity,
            priceAtTransaction: livePrice,
            priceLimit: type === 'limit' ? priceLimit : null,
            timestamp: new Date()
        };

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    let currentBalance = userData.balance;

                    // Calculate the total transaction amount
                    const transactionAmount = quantity * livePrice;

                    if (action === 'buy') {
                        currentBalance -= transactionAmount; // Subtract from balance
                    } else if (action === 'sell') {
                        currentBalance += transactionAmount; // Add to balance
                    }

                    if (currentBalance < 0) {
                        alert('Insufficient balance to complete the transaction.');
                        return;
                    }

                    // Update the user's balance and add the order
                    await updateDoc(userDocRef, {
                        balance: currentBalance,
                        orders: arrayUnion(orderDetails)
                    });

                    console.log('Order submitted successfully:', orderDetails);
                    alert('Order submitted successfully!');
                } else {
                    console.log('User document does not exist.');
                    alert('User document does not exist.');
                }
            } else {
                console.log('No user is signed in.');
                alert('No user is signed in.');
            }
        });
    }).catch(error => {
        console.error('Error fetching live price:', error);
        alert('Error fetching live price. Please try again.');
    });
}
