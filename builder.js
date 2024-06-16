class Burger {
  constructor() {
    this.bun = "";
    this.patty = "";
    this.toppings = [];
    this.sauces = [];
  }
}

class BurgerBuilder {
  constructor() {
    this.burger = new Burger();
  }

  addBun(bun) {
    this.burger.bun = bun;
    return this;
  }

  addPatty(patty) {
    this.burger.patty = patty;
    return this;
  }

  addTopping(topping) {
    this.burger.toppings.push(topping);
    return this;
  }

  addSauce(sauce) {
    this.burger.sauces.push(sauce);
    return this;
  }

  build() {
    return this.burger;
  }
}

const customBurger = new BurgerBuilder()
  .addBun("Whole Wheat")
  .addPatty("Beef")
  .addTopping("Lettuce")
  .addTopping("Tomato")
  .addSauce("Mayonnaise")
  .addSauce("Mustard")
  .build();

console.log(customBurger);
