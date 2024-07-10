// https://github.com/kumaransg/LLD/tree/main/StockExchange

const fs = require('fs');
const readline = require('readline');

// Order class to represent each order in the system
class Order {
  constructor(id, time, stock, type, price, quantity) {
    this.id = id; // Order ID
    this.time = time; // Order time
    this.stock = stock; // Stock symbol
    this.type = type; // Order type: buy or sell
    this.price = parseFloat(price); // Order price
    this.quantity = parseInt(quantity); // Order quantity
  }
}

// OrderBook class to manage buy and sell orders
class OrderBook {
  constructor() {
    this.buyOrders = []; // Array to store buy orders
    this.sellOrders = []; // Array to store sell orders
  }

  // Method to add an order to the order book
  addOrder(order) {
    if (order.type === 'buy') {
      this.buyOrders.push(order); // Add to buy orders array
      // Sort buy orders by price (highest first) and then by time (earliest first)
      this.buyOrders.sort((a, b) => b.price - a.price || new Date(a.time) - new Date(b.time));
    } else {
      this.sellOrders.push(order); // Add to sell orders array
      // Sort sell orders by price (lowest first) and then by time (earliest first)
      this.sellOrders.sort((a, b) => a.price - b.price || new Date(a.time) - new Date(b.time));
    }
  }

  // Method to match buy and sell orders
  matchOrders() {
    while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
      let buyOrder = this.buyOrders[0]; // Get the first buy order
      let sellOrder = this.sellOrders[0]; // Get the first sell order

      if (buyOrder.price >= sellOrder.price) {
        // If buy price is greater than or equal to sell price, a trade occurs
        let tradeQuantity = Math.min(buyOrder.quantity, sellOrder.quantity); // Determine trade quantity
        let tradePrice = sellOrder.price; // Trade price is the sell order price

        // Log the trade
        console.log(`#${buyOrder.id} ${tradePrice} ${tradeQuantity} #${sellOrder.id}`);

        // Adjust quantities of the orders after the trade
        buyOrder.quantity -= tradeQuantity;
        sellOrder.quantity -= tradeQuantity;

        // Remove the order if its quantity becomes zero
        if (buyOrder.quantity === 0) {
          this.buyOrders.shift();
        }
        if (sellOrder.quantity === 0) {
          this.sellOrders.shift();
        }
      } else {
        break; // No more matching possible
      }
    }
  }
}

// Function to process the input file
async function processFile(filePath) {
  const orderBook = new OrderBook();

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // Read the file line by line
  for await (const line of rl) {
    const [id, time, stock, type, price, quantity] = line.split(' ');
    const order = new Order(id, time, stock, type, price, quantity);
    orderBook.addOrder(order); // Add order to the order book
    orderBook.matchOrders(); // Attempt to match orders
  }
}

// The first argument is the file path
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide the file path as an argument.');
  process.exit(1);
}

processFile(filePath);
