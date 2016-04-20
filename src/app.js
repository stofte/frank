import 'codemirror/lib/codemirror.css!';
import CodeMirror from 'codemirror';

export class App {
    heading = 'Welcome to Aurelia!';
    firstName = 'John';
    lastName = 'Doe';
    mirror = null;

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    submit() {
        alert(`Welcome, ${this.fullName}!`);
    }

    attached() {
        this.mirror = CodeMirror.fromTextArea(this.editorElement, {
            lineNumbers: true
        });
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
