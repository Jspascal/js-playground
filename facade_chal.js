class Projector {
  turnOn() {
    console.log("Projector turned on");
  }

  turnOff() {
    console.log("Projector turned off");
  }
}

class Screen {
  open() {
    console.log("Screen opened");
  }

  close() {
    console.log("Screen closed");
  }
}

class SoundSystem {
  turnOn() {
    console.log("Sound system turned on");
  }

  turnOff() {
    console.log("Sound system turned off");
  }
}

class HomeTheaterFacade {
  constructor() {
    this.projector = new Projector();
    this.screen = new Screen();
    this.soundSystem = new SoundSystem();
  }

  watchMovie() {
    this.projector.turnOn();
    this.screen.open();
    this.soundSystem.turnOn();
    console.log("Enjoy the movie!");
  }

  endMovie() {
    this.projector.turnOff();
    this.screen.close();
    this.soundSystem.turnOff();
    console.log("Movie ended");
  }
}

const homeTheater = new HomeTheaterFacade();

homeTheater.watchMovie();

homeTheater.endMovie();
