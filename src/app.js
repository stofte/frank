import 'codemirror/lib/codemirror.css!';
import CodeMirror from 'codemirror';
import OmnisharpWatcher from './OmnisharpWatcher';

let watcher = new OmnisharpWatcher();
watcher.start();

export class App {
    mirror = null;

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
