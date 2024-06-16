interface Device {
    turnOn(): void;
    turnOff(): void;
}

class Projector implements Device {
    turnOn() {
        console.log("Projector turned on");
    }

    turnOff() {
        console.log("Projector turned off");
    }
}

class Screen implements Device {
    turnOn() {
        console.log("Screen opened");
    }

    turnOff() {
        console.log("Screen closed");
    }
}

class SoundSystem implements Device {
    turnOn() {
        console.log("Sound system turned on");
    }

    turnOff() {
        console.log("Sound system turned off");
    }
}

class HomeTheaterFacade {
    private projector: Projector;
    private screen: Screen;
    private soundSystem: SoundSystem;

    constructor() {
        this.projector = new Projector();
        this.screen = new Screen();
        this.soundSystem = new SoundSystem();
    }

    watchMovie() {
        this.projector.turnOn();
        this.screen.turnOn();
        this.soundSystem.turnOn();
        console.log("Enjoy the movie!");
    }

    endMovie() {
        this.projector.turnOff();
        this.screen.turnOff();
        this.soundSystem.turnOff();
        console.log("Movie ended");
    }
}

const homeTheater = new HomeTheaterFacade();
homeTheater.watchMovie();
homeTheater.endMovie();