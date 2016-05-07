import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import config from '../config';

const child_process = require('child_process');
const ipc = require('electron').ipcRenderer;

@inject(HttpClient)
export default class QueryEngineService {
    process = null;
    port = config.queryEnginePort;
    started = false;
    http = null;

    constructor(http) { 
        this.http = http;
        ipc.on('application-event', this.applicationEventHandler.bind(this));
    }

    applicationEventHandler(event, msg) {
        if (msg === 'close') {
            let cb = () => ipc.send('application-event', 'close-query-engine');
            this.http.fetch(this.action('stopserver'))
                .then(cb, cb); // todo this is stupid
        }
    }

    start() {
        this.http.fetch(this.action('checkreadystatus'))
            .then(() => console.log('query-engine already running'))
            .catch(() => {
                let cmd = '"C:/Program Files/dotnet/dotnet.exe" run';
                this.process = child_process.exec(cmd, {
                    cwd: 'C:/src/frank/query-engine'
                }, (error, stdout, stderr) => {
                    console.log('returned');
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);            
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
                this.started = this.process && this.process.stdio;
            });
    }

    action(name) {
        return `http://localhost:${this.port}/${name}`;
    }
}