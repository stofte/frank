import {inject} from 'aurelia-framework';
import CodeMirror from 'codemirror';
import OmnisharpService from './module/OmnisharpService';
import QueryEngineService from './module/QueryEngineService';

import 'codemirror/lib/codemirror.css!';
import 'normalize.css/normalize.css!';
import './style/basic.css!';

@inject(OmnisharpService, QueryEngineService)
export class App {
    mirror = null;
    omnisharp = null;
    queryEngine = null;

    constructor(omnisharp, queryEngine) {
        this.omnisharp = omnisharp;
        this.queryEngine = queryEngine;
        this.omnisharp.start();
        this.queryEngine.start();
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
