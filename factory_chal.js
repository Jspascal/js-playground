class Vehicle {
  drive() {
    console.log("Driving a vehicle...");
  }
}

class Car extends Vehicle {
  drive() {
    console.log("Driving a car...");
  }
}

class Bicycle extends Vehicle {
  drive() {
    console.log("Riding a bicycle...");
  }
}

class VehicleFactory {
  createVehicle() {
    throw new Error("This method must be overridden");
  }
}

class CarFactory extends VehicleFactory {
  createVehicle() {
    return new Car();
  }
}

class BicycleFactory extends VehicleFactory {
  createVehicle() {
    return new Bicycle();
  }
}

const carFactory = new CarFactory();
const car = carFactory.createVehicle();
car.drive();

const bicycleFactory = new BicycleFactory();
const bicycle = bicycleFactory.createVehicle();
bicycle.drive();
