import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

const child_process = require('child_process');
const ipc = require('electron').ipcRenderer;

@inject(HttpClient)
export default class OmnisharpWatcher {
    process = null;
    port = 2000;
    started = false;
    http = null;

    constructor(http) { 
        this.http = http;
        ipc.on('application-event', this.applicationEventHandler.bind(this));
    }

    applicationEventHandler(event, msg) {
        if (msg === 'close') {
            let cb = () => ipc.send('application-event', 'close');
            this.http.fetch(this.action('stopserver'))
                .then(cb, cb); // todo this is stupid
        }
    }

    start() {
        this.http.fetch(this.action('checkreadystatus'))
            .then(() => console.log('omnisharp already running'))
            .catch(() => {
                let slnPath = 'C:/Projects/ConsoleApp1/ConsoleApp1.sln';
                let cmd = `${__dirname}/omnisharp/Omnisharp.exe -s ${slnPath} -p ${this.port}`;
                this.process = child_process.exec(cmd, (error, stdout, stderr) => {
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