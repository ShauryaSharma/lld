// https://docs.google.com/document/d/1Bmkz9omByHqVvwU45cvkBRSwJAPKw9yaDsRlEnCg_lg/edit

class User {
    constructor(name, gender, phoneNumber, pincode) {
      this.name = name;
      this.gender = gender;
      this.phoneNumber = phoneNumber;
      this.pincode = pincode;
      this.orders = [];
    }
  }
  
  class Restaurant {
    constructor(name, serviceablePincodes, foodItem, price, initialQuantity) {
      this.name = name;
      this.serviceablePincodes = serviceablePincodes.split('/');
      this.foodItem = foodItem;
      this.price = price;
      this.quantity = initialQuantity;
      this.ratings = [];
    }
  
    // Method to add quantity of the food item
    addQuantity(quantity) {
      this.quantity += quantity;
    }
  
    // Method to calculate average rating of the restaurant
    getAverageRating() {
      if (this.ratings.length === 0) return 0;
      let sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return sum / this.ratings.length;
    }
  
    // Method to add a rating to the restaurant
    addRating(rating, comment) {
      this.ratings.push({ rating, comment });
    }
  
    // Check if the restaurant is serviceable to a given pincode
    isServiceable(pincode) {
      return this.serviceablePincodes.includes(pincode) && this.quantity > 0;
    }
  }
  
  class FoodOrderingService {
    constructor() {
      this.users = [];
      this.restaurants = [];
      this.currentUser = null;
    }
  
    // Method to register a user
    registerUser(name, gender, phoneNumber, pincode) {
      let user = new User(name, gender, phoneNumber, pincode);
      this.users.push(user);
    }
  
    // Method to login a user
    loginUser(phoneNumber) {
      this.currentUser = this.users.find(user => user.phoneNumber === phoneNumber);
      if (!this.currentUser) {
        console.log(`User with phone number ${phoneNumber} not found.`);
      } else {
        console.log(`User ${this.currentUser.name} logged in.`);
      }
    }
  
    // Method to register a restaurant
    registerRestaurant(name, serviceablePincodes, foodItem, price, initialQuantity) {
      if (this.currentUser) {
        let restaurant = new Restaurant(name, serviceablePincodes, foodItem, price, initialQuantity);
        this.restaurants.push(restaurant);
        console.log(`Restaurant ${name} registered successfully.`);
      } else {
        console.log('Please log in to register a restaurant.');
      }
    }
  
    // Method to update quantity of a restaurant's food item
    updateQuantity(restaurantName, quantityToAdd) {
      let restaurant = this.restaurants.find(rest => rest.name === restaurantName);
      if (restaurant) {
        restaurant.addQuantity(quantityToAdd);
        console.log(`${restaurantName} - ${restaurant.foodItem} - ${restaurant.quantity}`);
      } else {
        console.log(`Restaurant ${restaurantName} not found.`);
      }
    }
  
    // Method to rate a restaurant
    rateRestaurant(restaurantName, rating, comment = '') {
      let restaurant = this.restaurants.find(rest => rest.name === restaurantName);
      if (restaurant) {
        restaurant.addRating(rating, comment);
        console.log(`Rated ${restaurantName} with ${rating} stars.`);
      } else {
        console.log(`Restaurant ${restaurantName} not found.`);
      }
    }
  
    // Method to show restaurants based on rating or price
    showRestaurant(orderBy) {
      let serviceableRestaurants = this.restaurants.filter(rest => 
        rest.isServiceable(this.currentUser.pincode)
      );
      if (orderBy === 'rating') {
        serviceableRestaurants.sort((a, b) => b.getAverageRating() - a.getAverageRating());
      } else if (orderBy === 'price') {
        serviceableRestaurants.sort((a, b) => b.price - a.price);
      }
      for (let restaurant of serviceableRestaurants) {
        console.log(`${restaurant.name}, ${restaurant.foodItem}`);
      }
    }
  
    // Method to place an order
    placeOrder(restaurantName, quantity) {
      let restaurant = this.restaurants.find(rest => rest.name === restaurantName);
      if (restaurant) {
        if (restaurant.isServiceable(this.currentUser.pincode) && restaurant.quantity >= quantity) {
          restaurant.quantity -= quantity;
          this.currentUser.orders.push({ restaurantName, quantity });
          console.log('Order placed successfully.');
        } else {
          console.log('Cannot place order.');
        }
      } else {
        console.log(`Restaurant ${restaurantName} not found.`);
      }
    }
  
    // Method to update restaurant serviceable locations
    updateLocation(restaurantName, serviceablePincodes) {
      let restaurant = this.restaurants.find(rest => rest.name === restaurantName);
      if (restaurant) {
        restaurant.serviceablePincodes = serviceablePincodes.split('/');
        console.log(`${restaurantName}, ${serviceablePincodes}`);
      } else {
        console.log(`Restaurant ${restaurantName} not found.`);
      }
    }
  }
  
  // Testing the implementation with sample test cases
  
  let service = new FoodOrderingService();
  
  // Registering users
  service.registerUser('Pralove', 'M', 'phoneNumber-1', 'HSR');
  service.registerUser('Nitesh', 'M', 'phoneNumber-2', 'BTM');
  service.registerUser('Vatsal', 'M', 'phoneNumber-3', 'BTM');
  
  // Logging in users and registering restaurants
  service.loginUser('phoneNumber-1');
  service.registerRestaurant('Food Court-1', 'BTM/HSR', 'NI Thali', 100, 5);
  service.registerRestaurant('Food Court-2', 'BTM', 'Burger', 120, 3);
  
  service.loginUser('phoneNumber-2');
  service.registerRestaurant('Food Court-3', 'HSR', 'SI Thali', 150, 1);
  
  service.loginUser('phoneNumber-3');
  service.showRestaurant('price');
  
  // Placing orders and rating restaurants
  service.placeOrder('Food Court-1', 2);
  service.placeOrder('Food Court-2', 7);
  service.rateRestaurant('Food Court-2', 3, 'Good Food');
  service.rateRestaurant('Food Court-1', 5, 'Nice Food');
  
  service.showRestaurant('rating');
  
  // Logging in and updating quantity and location
  service.loginUser('phoneNumber-1');
  service.updateQuantity('Food Court-2', 5);
  service.updateLocation('Food Court-2', 'BTM/HSR');
  