// https://leetcode.com/discuss/interview-experience/1325321/flipkart-sde-2-bangalore-india-june-2021-reject

const readline = require('readline');

// Utility function to convert units
const convertSize = (sizeStr) => {
    const units = {
        'sqft': 1,
        'sqm': 10.7639,
        'sqyd': 9
    };

    const sizeRegex = /^(\d+\.?\d*)\s*(sqft|sqm|sqyd)$/i;
    const match = sizeStr.match(sizeRegex);

    if (!match) {
        throw new Error("Invalid size format");
    }

    const size = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    return size * units[unit];
};

// Utility function to convert price to a comparable number
const convertPrice = (priceStr) => {
    const priceRegex = /^(\d+\.?\d*)\s*(k|l|cr)?$/i;
    const match = priceStr.match(priceRegex);

    if (!match) {
        throw new Error("Invalid price format");
    }

    const price = parseFloat(match[1]);
    const unit = match[2] ? match[2].toLowerCase() : '';

    switch (unit) {
        case 'k':
            return price * 1e3;
        case 'l':
            return price * 1e5;
        case 'cr':
            return price * 1e7;
        default:
            return price;
    }
};

// Class to manage properties
class Property {
    constructor(id, userId, title, location, price, type, size, rooms) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.location = location;
        this.price = convertPrice(price);
        this.type = type;
        this.size = convertSize(size);
        this.rooms = rooms;
        this.status = 'available';
    }
}

// Class to manage users
class User {
    constructor(name) {
        this.name = name;
        this.properties = [];
        this.shortlisted = [];
    }
}

// Main class for the property management system
class PropertyManagementSystem {
    constructor() {
        this.users = {};
        this.properties = {};
        this.nextPropertyId = 1;
    }

    registerUser(name) {
        if (this.users[name]) {
            throw new Error("User already exists");
        }
        this.users[name] = new User(name);
        console.log('User registered successfully.');
    }

    registerProperty(userId, title, location, price, type, size, rooms) {
        if (!this.users[userId]) {
            throw new Error("User does not exist");
        }
        const property = new Property(this.nextPropertyId++, userId, title, location, price, type, size, rooms);
        this.properties[property.id] = property;
        this.users[userId].properties.push(property.id);
        console.log('Property listed successfully.');
    }

    viewListedProperties(userId) {
        if (!this.users[userId]) {
            throw new Error("User does not exist");
        }
        const properties = this.users[userId].properties.map(id => this.properties[id]);
        console.table(properties);
    }

    shortlistProperty(userId, propertyId) {
        if (!this.users[userId]) {
            throw new Error("User does not exist");
        }
        if (!this.properties[propertyId]) {
            throw new Error("Property does not exist");
        }
        this.users[userId].shortlisted.push(propertyId);
        console.log('Shortlisted property');
    }

    viewShortlistedProperties(userId) {
        if (!this.users[userId]) {
            throw new Error("User does not exist");
        }
        const properties = this.users[userId].shortlisted.map(id => this.properties[id]);
        console.table(properties);
    }

    searchProperties(location, priceRange, type, sizeRange, rooms, sortBy) {
        let results = Object.values(this.properties).filter(property => {
            if (property.status !== 'available') return false;
            if (location && property.location.toLowerCase() !== location.toLowerCase()) return false;
            if (priceRange) {
                const [minPrice, maxPrice] = priceRange.split('-').map(convertPrice);
                if (property.price < minPrice || property.price > maxPrice) return false;
            }
            if (type && property.type.toLowerCase() !== type.toLowerCase()) return false;
            if (sizeRange) {
                const [minSize, maxSize] = sizeRange.split('-').map(convertSize);
                if (property.size < minSize || property.size > maxSize) return false;
            }
            if (rooms && property.rooms !== parseInt(rooms)) return false;
            return true;
        });

        if (sortBy === 'price') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'size') {
            results.sort((a, b) => a.size - b.size);
        }

        console.table(results);
    }

    markSold(userId, propertyId) {
        if (!this.users[userId]) {
            throw new Error("User does not exist");
        }
        if (!this.properties[propertyId]) {
            throw new Error("Property does not exist");
        }
        const property = this.properties[propertyId];
        if (property.userId !== userId) {
            throw new Error("User does not own this property");
        }
        property.status = 'sold';
        console.log('Property marked as sold');
    }
}

// CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pms = new PropertyManagementSystem();

const commands = {
    'register_user': (args) => pms.registerUser(args[0]),
    'register_property': (args) => pms.registerProperty(...args),
    'view_listed': (args) => pms.viewListedProperties(args[0]),
    'shortlist_property': (args) => pms.shortlistProperty(...args),
    'view_shortlisted': (args) => pms.viewShortlistedProperties(args[0]),
    'search_properties': (args) => pms.searchProperties(...args),
    'mark_sold': (args) => pms.markSold(...args),
};

console.log('Enter commands:');

rl.on('line', (input) => {
    const [command, ...args] = input.split(',').map(arg => arg.trim());
    try {
        if (commands[command]) {
            commands[command](args);
        } else {
            console.log('Invalid command');
        }
    } catch (error) {
        console.log(error.message);
    }
});
