class ThemeFactory {
  createButton() {}
  createCheckbox() {}
}

class LightThemeFactory extends ThemeFactory {
  createButton() {
    return new LightButton();
  }

  createCheckbox() {
    return new LightCheckbox();
  }
}

class DarkThemeFactory extends ThemeFactory {
  createButton() {
    return new DarkButton();
  }

  createCheckbox() {
    return new DarkCheckbox();
  }
}

class Button {
  render() {}
}

class LightButton extends Button {
  render() {
    console.log("Rendering Light Button");
  }
}

class DarkButton extends Button {
  render() {
    console.log("Rendering Dark Button");
  }
}

class Checkbox {
  render() {}
}

class LightCheckbox extends Checkbox {
  render() {
    console.log("Rendering Light Checkbox");
  }
}

class DarkCheckbox extends Checkbox {
  render() {
    console.log("Rendering Dark Checkbox");
  }
}

function createUI(theme) {
  let factory;

  if (theme === "light") {
    factory = new LightThemeFactory();
  } else if (theme === "dark") {
    factory = new DarkThemeFactory();
  } else {
    throw new Error("Unknown theme");
  }

  const button = factory.createButton();
  const checkbox = factory.createCheckbox();

  button.render();
  checkbox.render();
}

createUI("light");
createUI("dark");
