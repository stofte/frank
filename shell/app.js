import {inject} from 'aurelia-framework';
import CodeMirror from 'codemirror';
import OmnisharpWatcher from './module/OmnisharpWatcher';

import 'codemirror/lib/codemirror.css!';
import 'normalize.css/normalize.css!';

@inject(OmnisharpWatcher)
export class App {
    mirror = null;
    omnisharp = null;

    constructor(omnisharp) {
        this.omnisharp = omnisharp;
        this.omnisharp.start();
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
