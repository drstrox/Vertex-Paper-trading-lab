from flask import Flask, jsonify, render_template, request, redirect, url_for, send_from_directory
import os
import sqlite3
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)


# Path to the main directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route('/home.css')
def home_css():
    return send_from_directory('.', 'home.css')

@app.route('/log.css')
def log_css():
    return send_from_directory('.', 'log.css')

@app.route('/aboutusstyle.css')
def aboutus_css():
    return send_from_directory('.', 'aboutusstyle.css')

@app.route('/signup.css')
def signup_css():
    return send_from_directory('.', 'signup.css')



@app.route('/bg3.png')
def bg3_png():
    return send_from_directory('.', 'bg3.png')

@app.route('/login.png')
def login_png():
    return send_from_directory('.', 'login.png')

@app.route('/aboutusscript.js')
def aboutus_script_js():
    return send_from_directory('.', 'aboutusscript.js')

@app.route('/portfolioscript.js')
def portfolio_script_js():
    return send_from_directory('.', 'portfolio.js')

@app.route('/portfolioscript1.js')
def portfolio_script1_js():
    return send_from_directory('.', 'portfolioscript1.js')




@app.route('/signup.js')
def signup_js():
    return send_from_directory('.', 'signup.js')

@app.route('/log.js')
def log_js():
    return send_from_directory('.', 'log.js')

@app.route('/logo.svg')
def logo_svg():
    return send_from_directory('.', 'logo.svg')

@app.route('/google.jpg')
def google_jpg():
    return send_from_directory('.', 'google.jpg')

@app.route('/nirdosh.jpg')
def investor1():
    return send_from_directory('.', 'nirdosh.jpg')

@app.route('/vansh.jpg')
def investor2():
    return send_from_directory('.', 'vansh.jpg')

@app.route('/AAYUSH.jpg')
def investor3():
    return send_from_directory('.', 'AAYUSH.jpg')

@app.route('/maynk.jpg')
def investor4():
    return send_from_directory('.', 'maynk.jpg')

@app.route('/create account.jpg')
def create_account_jpg():
    return send_from_directory('.', 'create account.jpg')


@app.route('/chart.png')
def chart_png():
    return send_from_directory('.', 'chart.png')

@app.route('/portfolio.png')
def portfolio_png():
    return send_from_directory('.', 'portfolio.png')

@app.route('/responsive.png')
def responsive_png():
    return send_from_directory('.', 'responsive.png')

@app.route('/realtime.jpeg')
def realtime_jpeg():
    return send_from_directory('.', 'realtime.jpeg')

@app.route('/applelogo.jpeg')
def apple_jpeg():
    return send_from_directory('.', 'applelogo.jpeg')

@app.route('/amazonlogo.jpeg')
def amazon_jpeg():
    return send_from_directory('.', 'amazonlogo.jpeg')

@app.route('/nvidialogo.jpeg')
def nvidia_jpeg():
    return send_from_directory('.', 'nvidialogo.jpeg')

@app.route('/microsoft.jpg')
def micro_jpeg():
    return send_from_directory('.', 'microsoft.jpg')

@app.route('/meta.jpg')
def meta_jpeg():
    return send_from_directory('.', 'meta.jpg')

@app.route('/tesla.jpg')
def tesla_jpeg():
    return send_from_directory('.', 'tesla.jpg')

@app.route('/walmart.jpeg')
def walmart_jpeg():
    return send_from_directory('.', 'walmart.jpeg')

@app.route('/berkshirehathway.jpg')
def berk_jpeg():
    return send_from_directory('.', 'berkshirehathway.jpg')

@app.route('/broadcom.jpg')
def broadcom_jpeg():
    return send_from_directory('.', 'broadcom.jpg')

@app.route('/jpmorgan.png')
def morgan_jpeg():
    return send_from_directory('.', 'jpmorgan.png')

@app.route('/novo-nordisk-logo.jpg')
def novo_jpeg():
    return send_from_directory('.', 'novo-nordisk-logo.jpg')

@app.route('/aboutusimage.jpg')
def abtus_img():
    return send_from_directory('.', 'aboutusimage.jpg')

@app.route('/united health.png')
def united_jpeg():
    return send_from_directory('.', 'united health.png')

@app.route('/tencent.jpg')
def tencent_jpeg():
    return send_from_directory('.', 'tencent.jpg')

@app.route('/mastercard.jpeg')
def mastercard_jpeg():
    return send_from_directory('.', 'mastercard.jpeg')



@app.route('/ios app.png')
def ios_app_png():
    return send_from_directory('.', 'ios app.png')

@app.route('/android app (2).png')
def android_app_png():
    return send_from_directory('.', 'android app (2).png')

@app.route('/web app.png')
def web_app_png():
    return send_from_directory('.', 'web app.png')


# Route to fetch all stocks
@app.route('/stocks', methods=['GET'])
def get_stocks():
    connection = sqlite3.connect('groww.db')
    cursor = connection.cursor()
    cursor.execute("SELECT symbol, company FROM stock")
    stocks = cursor.fetchall()
    connection.close()
    return jsonify(stocks)


# Route to fetch individual stock details and render TradingView chart
@app.route('/stock/<symbol>', methods=['GET'])
def stock_details(symbol):
    connection = sqlite3.connect('groww.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM stock WHERE symbol = ?", (symbol,))
    stock = cursor.fetchone()
    connection.close()

    if stock:
        return render_template('stock_details.html', stock=stock, symbol=symbol)
    else:
        return "Stock not found", 404




# Route to render the home page
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

def get_stock_symbol(stock_id):
    conn = sqlite3.connect('groww.db')
    c = conn.cursor()
    c.execute('SELECT symbol FROM stock WHERE id = ?', (stock_id,))
    symbol = c.fetchone()
    conn.close()
    return symbol[0] if symbol else None


@app.route('/aboutus')
def aboutus():
    return send_from_directory(BASE_DIR, 'aboutus.html')

@app.route('/signup')
def signup():
    return send_from_directory(BASE_DIR, 'singup.html')

@app.route('/fundamental')
def fundamental():
    
    return render_template('fundamental.html')
    

@app.route('/login')
def login():
    return send_from_directory(BASE_DIR, 'log.html')

@app.route('/chartingtools.html')
def chartingtools():
    return send_from_directory(BASE_DIR, 'chartingtools.html')



@app.route('/technicalanalysis.html')
def technicalanalysis():
    return send_from_directory(BASE_DIR, 'technicalanalysis.html')

@app.route('/stockscreener.html')
def chartingols():
    return send_from_directory(BASE_DIR, 'stockscreener.html')

@app.route('/backtesting.html')
def backtesting():
    return send_from_directory(BASE_DIR, 'backtesting.html')

@app.route('/news.html')
def news():
    return send_from_directory(BASE_DIR, 'news.html')

@app.route('/portfolio.html')
def portfolio():
    return send_from_directory(BASE_DIR, 'portfolio.html')

@app.route('/back_testing.js')
def backtesting_js():
    return send_from_directory(BASE_DIR, 'back_testing.js')

@app.route('/portfolio.js')
def portfolio_js():
    return send_from_directory(BASE_DIR, 'portfolio.js')

@app.route('/loggedinscript.js')
def loggedin_script_js():
    return send_from_directory(BASE_DIR, 'loggedinscript.js')

@app.route('/back_testing.css')
def backtesting_css():
    return send_from_directory(BASE_DIR, 'back_testing.css')

@app.route('/loggedin.css')
def login_css():
    return send_from_directory(BASE_DIR, 'loggedin.css')

@app.route('/backtesting.jpg')
def backtesting_jpg():
    return send_from_directory(BASE_DIR, 'backtesting.jpg')

# Route to render the loggedIn page
@app.route('/dashboard')
def dashboard():
    return render_template('loggedIn.html')

def get_stock_symbol(stock_id):
    conn = sqlite3.connect('groww.db')
    c = conn.cursor()
    c.execute('SELECT symbol FROM stock WHERE id = ?', (stock_id,))
    symbol = c.fetchone()
    conn.close()
    return symbol[0] if symbol else None

def insert_trade(trade):
    conn = sqlite3.connect('trades.db')
    c = conn.cursor()
    symbol = get_stock_symbol(trade['symbol'])  # Fetch the actual stock symbol
    if not symbol:
        raise ValueError("Invalid stock symbol ID")
    c.execute('''
        INSERT INTO trades (symbol, action, mode, type, quantity, price_limit)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (symbol, trade['action'], trade['mode'], trade['type'], trade['quantity'], trade.get('priceLimit')))
    conn.commit()
    conn.close()

@app.route('/submit_order', methods=['POST'])
def submit_order():
    order_details = request.json
    # Here, you could log the order or perform additional server-side processing if needed
    print(f"Order received: {order_details}")
    return jsonify({"message": "Order received"}), 200
    

@app.route('/held_stocks', methods=['GET'])
def held_stocks():
    try:
        # Connect to the database
        conn = sqlite3.connect('trades.db')
        cursor = conn.cursor()

        # Query to select all trades
        query = 'SELECT symbol, action, quantity FROM trades'
        cursor.execute(query)
        trades = cursor.fetchall()
        conn.close()

        # Dictionary to hold the net quantity of each stock
        held_stocks = {}

        # Process each trade
        for trade in trades:
            symbol = trade[0]
            action = trade[1]
            quantity = trade[2]

            if action == 'buy':
                held_stocks[symbol] = held_stocks.get(symbol, 0) + quantity
            elif action == 'sell':
                held_stocks[symbol] = held_stocks.get(symbol, 0) - quantity

        # Filter out stocks with zero or negative quantity
        held_stocks = {symbol: qty for symbol, qty in held_stocks.items() if qty > 0}

        return jsonify(held_stocks)

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
