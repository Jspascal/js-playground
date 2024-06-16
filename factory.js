const Vehicle = {
  init: function (make, model) {
    this.make = make;
    this.model = model;
  },
  getInfo: function () {
    return `${this.make} ${this.model}`;
  },
  clone: function () {
    const clone = Object.create(this);
    return clone;
  },
};

const car = Vehicle.clone();
car.init("Toyota", "Camry");
const bike = Vehicle.clone();
bike.init("Honda", "CBR");

console.log(car.getInfo());
console.log(bike.getInfo());
