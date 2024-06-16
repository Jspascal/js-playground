class User {
  constructor(name) {
    this.name = name;
  }

  performAction(action) {
    console.log(`${this.name} performed ${action}`);
  }
}

function logActions(user) {
  const originalAction = user.performAction;
  user.performAction = function (action) {
    console.log(`Logging: ${user.name} performed ${action}`);
    originalAction.call(user, action);
  };
  return user;
}

const regularUser = new User("Joseph");
const premiumUser = logActions(new User("Pascal"));
const adminUser = logActions(new User("Nomo"));

regularUser.performAction("view");
premiumUser.performAction("edit");
adminUser.performAction("delete");
