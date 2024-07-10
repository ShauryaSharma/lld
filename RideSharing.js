//https://github.com/kumaransg/LLD/tree/main/Ride%20Sharing%20/RideShare_MachineCoding_Sample

// User class to represent a user with their details and vehicles
class User {
    constructor(name, gender, age) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.vehicles = [];
        this.ridesOffered = 0;
        this.ridesTaken = 0;
    }

    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
    }
}

// Vehicle class to represent a vehicle
class Vehicle {
    constructor(owner, model, number) {
        this.owner = owner;
        this.model = model;
        this.number = number;
    }
}

// Ride class to represent a ride with all its details
class Ride {
    constructor(driver, origin, destination, availableSeats, vehicle, startTime, duration) {
        this.driver = driver;
        this.origin = origin;
        this.destination = destination;
        this.availableSeats = availableSeats;
        this.vehicle = vehicle;
        this.startTime = new Date(startTime);
        this.duration = duration;
        this.passengers = [];
    }

    addPassenger(passenger) {
        if (this.availableSeats > 0) {
            this.passengers.push(passenger);
            this.availableSeats--;
            return true;
        }
        return false;
    }

    get endTime() {
        return new Date(this.startTime.getTime() + this.duration * 60 * 60 * 1000);
    }
}

// RideSharingApp class to manage users and rides
class RideSharingApp {
    constructor() {
        this.users = {};
        this.rides = [];
    }

    // Method to add a user
    addUser(name, gender, age) {
        if (!this.users[name]) {
            this.users[name] = new User(name, gender, age);
            console.log(`User ${name} added successfully.`);
        } else {
            console.log(`User ${name} already exists.`);
        }
    }

    // Method to add a vehicle to a user
    addVehicle(userName, model, number) {
        if (this.users[userName]) {
            const vehicle = new Vehicle(userName, model, number);
            this.users[userName].addVehicle(vehicle);
            console.log(`Vehicle ${model} (${number}) added to user ${userName}.`);
        } else {
            console.log(`User ${userName} not found.`);
        }
    }

    // Method to offer a ride
    offerRide(driver, origin, destination, availableSeats, vehicleNumber, startTime, duration) {
        if (this.users[driver]) {
            const user = this.users[driver];
            const vehicle = user.vehicles.find(v => v.number === vehicleNumber);
            if (vehicle) {
                const ride = new Ride(driver, origin, destination, availableSeats, vehicle, startTime, duration);
                this.rides.push(ride);
                user.ridesOffered++;
                console.log(`Ride offered by ${driver} from ${origin} to ${destination}.`);
            } else {
                console.log(`Vehicle ${vehicleNumber} not found for user ${driver}.`);
            }
        } else {
            console.log(`User ${driver} not found.`);
        }
    }

    // Method to select a ride based on a selection strategy
    selectRide(passenger, origin, destination, strategy) {
        const availableRides = this.rides.filter(ride =>
            ride.origin === origin && ride.destination === destination && ride.availableSeats > 0
        );

        if (availableRides.length === 0) {
            console.log(`No rides found from ${origin} to ${destination}.`);
            return;
        }

        let selectedRide;
        if (strategy === 'Fastest Ride') {
            selectedRide = availableRides.reduce((prev, curr) => (prev.endTime < curr.endTime ? prev : curr));
        } else if (strategy === 'Earliest Ride') {
            selectedRide = availableRides.reduce((prev, curr) => (prev.startTime < curr.startTime ? prev : curr));
        }

        if (selectedRide) {
            const added = selectedRide.addPassenger(passenger);
            if (added) {
                this.users[passenger].ridesTaken++;
                console.log(`Ride selected by ${passenger}: ${selectedRide.driver} from ${selectedRide.origin} to ${selectedRide.destination}.`);
            } else {
                console.log(`No available seats for ride selected by ${passenger}.`);
            }
        }
    }

    // Method to calculate the total fuel saved by a passenger
    calculateFuelSaved(passenger) {
        const ridesTaken = this.rides.filter(ride => ride.passengers.includes(passenger));
        const totalDuration = ridesTaken.reduce((sum, ride) => sum + ride.duration, 0);
        console.log(`Total fuel saved by ${passenger}: ${totalDuration} units.`);
    }

    // Method to find total rides offered and taken by a user
    findTotalRides(userName) {
        if (this.users[userName]) {
            const user = this.users[userName];
            console.log(`${userName}: ${user.ridesTaken} Taken, ${user.ridesOffered} Offered.`);
        } else {
            console.log(`User ${userName} not found.`);
        }
    }
}

// Driver code for testing
const app = new RideSharingApp();

// Onboard users
app.addUser("Rohan", "M", 36);
app.addVehicle("Rohan", "Swift", "KA-01-12345");

app.addUser("Shashank", "M", 29);
app.addVehicle("Shashank", "Baleno", "TS-05-62395");

app.addUser("Nandini", "F", 29);

app.addUser("Shipra", "F", 27);
app.addVehicle("Shipra", "Polo", "KA-05-41491");
app.addVehicle("Shipra", "Scooty", "KA-12-12332");

app.addUser("Gaurav", "M", 29);

// Offer rides
app.offerRide("Rohan", "Hyderabad", "Bangalore", 1, "KA-01-12345", "2019-01-25T08:00:00", 13);
app.offerRide("Shipra", "Bangalore", "Mysore", 1, "KA-12-12332", "2019-01-29T18:00:00", 10);
app.offerRide("Shipra", "Bangalore", "Mysore", 2, "KA-05-41491", "2019-01-30T18:00:00", 4);
app.offerRide("Shashank", "Hyderabad", "Bangalore", 2, "TS-05-62395", "2019-01-27T10:00:00", 14);

// Find rides
app.selectRide("Nandini", "Bangalore", "Mysore", "Fastest Ride");
app.selectRide("Gaurav", "Bangalore", "Mysore", "Earliest Ride");
app.selectRide("Shashank", "Mumbai", "Bangalore", "Fastest Ride");
app.selectRide("Rohan", "Hyderabad", "Bangalore", "Fastest Ride");

// Calculate fuel saved
app.calculateFuelSaved("Nandini");
app.calculateFuelSaved("Gaurav");

// Find total rides by user
app.findTotalRides("Nandini");
app.findTotalRides("Rohan");
app.findTotalRides("Shashank");
app.findTotalRides("Gaurav");
