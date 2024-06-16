class Subject {
  request() {
    console.log("RealSubject: Handling request.");
  }
}

class Proxy {
  constructor() {
    this.realSubject = new Subject();
  }

  request(user) {
    if (this.checkAccess(user)) {
      this.realSubject.request();
      this.logAccess(user);
    } else {
      console.log("Proxy: Access denied for user " + user);
    }
  }

  checkAccess(user) {
    if (user === "admin") {
      console.log("Proxy: Access granted for user " + user);
      return true;
    } else {
      console.log("Proxy: Access denied for user " + user);
      return false;
    }
  }

  logAccess(user) {
    console.log("Proxy: Logging the time of request for user " + user);
  }
}

const proxy = new Proxy();

proxy.request("admin");
proxy.request("guest");
