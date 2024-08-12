// Firebase and Firestore initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQvGkprrLIhpk5gS1QIfjHF7fjomidHMI",
  authDomain: "vertex-trading-platform.firebaseapp.com",
  projectId: "vertex-trading-platform",
  storageBucket: "vertex-trading-platform.appspot.com",
  messagingSenderId: "570296071360",
  appId: "1:570296071360:web:583bf8b724f8d224c1e925"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const orders = userData.orders || [];
                const portfolioBody = document.getElementById('portfolio-body');
                portfolioBody.innerHTML = ''; // Clear any existing rows
                
                // Display the total balance
                document.getElementById('total-balance').textContent = userData.balance.toFixed(2);

                let totalProfitLoss = 0;

                for (let i = 0; i < orders.length; i++) {
                    const order = orders[i];

                    // Create a row for each order
                    const row = document.createElement('tr');

                    // Add ID cell
                    const idCell = document.createElement('td');
                    idCell.textContent = i + 1;
                    row.appendChild(idCell);

                    // Add Stock Symbol cell
                    const symbolCell = document.createElement('td');
                    symbolCell.textContent = order.stockSymbol;
                    row.appendChild(symbolCell);

                    // Add Stock Name cell
                    const nameCell = document.createElement('td');
                    nameCell.textContent = order.stockName;
                    row.appendChild(nameCell);

                    // Add Order Type cell
                    const typeCell = document.createElement('td');
                    typeCell.textContent = order.action;
                    row.appendChild(typeCell);

                    // Add Order Mode cell
                    const modeCell = document.createElement('td');
                    modeCell.textContent = order.mode;
                    row.appendChild(modeCell);

                    // Add Quantity cell
                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = order.quantity;
                    row.appendChild(quantityCell);

                    // Add Price at Transaction cell
                    const priceCell = document.createElement('td');
                    priceCell.textContent = `$${order.priceAtTransaction}`;
                    row.appendChild(priceCell);

                    // Add Live Price cell (this will be updated later)
                    const livePriceCell = document.createElement('td');
                    livePriceCell.textContent = 'Loading...';
                    row.appendChild(livePriceCell);

                    // Add Profit/Loss cell
                    const profitLossCell = document.createElement('td');
                    profitLossCell.textContent = 'Calculating...';
                    row.appendChild(profitLossCell);

                    // Add Date and Time cell
                    const dateCell = document.createElement('td');
                    const date = new Date(order.timestamp.seconds * 1000);
                    dateCell.textContent = date.toLocaleString();
                    row.appendChild(dateCell);

                    // Append the row to the table body
                    portfolioBody.appendChild(row);

                    // Fetch and update live price and calculate profit/loss
                    fetchLivePrice(order.stockSymbol, livePriceCell, profitLossCell, order.priceAtTransaction, quantityCell, totalProfitLoss);
                }
            } else {
                console.error("User document does not exist.");
            }
        } else {
            console.error("No user is signed in.");
            window.location.href = '/login'; // Redirect to login page if not signed in
        }
    });
});

function fetchLivePrice(symbol, livePriceCell, profitLossCell, priceAtTransaction, quantityCell, totalProfitLoss) {
    const apiKey = 'cqfir39r01qle0e3q9k0cqfir39r01qle0e3q9kg'; // Replace with your actual Finnhub API key
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.c !== undefined && data.c !== 0) {
                livePriceCell.textContent = `$${data.c}`;
                livePriceCell.style.color = data.c >= 0 ? 'green' : 'red';

                const profitLoss = (data.c - priceAtTransaction) * parseInt(quantityCell.textContent);
                profitLossCell.textContent = `$${profitLoss.toFixed(2)}`;
                profitLossCell.style.color = profitLoss >= 0 ? 'green' : 'red';

                // Update total profit/loss
                totalProfitLoss += profitLoss;
                const totalProfitLossElement = document.getElementById('total-profit-loss');
                totalProfitLossElement.textContent = totalProfitLoss.toFixed(2);
                totalProfitLossElement.style.color = totalProfitLoss >= 0 ? 'green' : 'red';
            } else {
                livePriceCell.textContent = 'N/A';
                livePriceCell.style.color = 'black';
                profitLossCell.textContent = 'N/A';
                profitLossCell.style.color = 'black';
            }
        })
        .catch(error => {
            console.error('Error fetching live price:', error);
            livePriceCell.textContent = 'Error';
            livePriceCell.style.color = 'black';
            profitLossCell.textContent = 'Error';
            profitLossCell.style.color = 'black';
        });
}
