export class Welcome {
  heading = 'Welcome to Aurelia!';
  firstName = 'John';
  lastName = 'Doe';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    alert(`Welcome, ${this.fullName}!`);
  }

  get electronVersion() {
    return process.versions.electron;
  }

  get chromeVersion() {
    return process.versions.chrome;
  }

  get nodeVersion() {
    return process.versions.node;
  }

}
