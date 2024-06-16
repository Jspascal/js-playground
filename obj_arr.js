const users = {};

function put(user) {
  users[user.id] = user;
}

function update(user) {
  if (users[user.id]) {
    users[user.id] = user;
  } else {
    console.log("User not found");
  }
}

function remove(id) {
  if (users[id]) {
    delete users[id];
  } else {
    console.log("User not found");
  }
}

put({ id: 1, name: "Alice" });
put({ id: 2, name: "Bob" });

console.log(users);

update({ id: 1, name: "Alice Smith" });

console.log(users);

remove(2);

console.log(users);
