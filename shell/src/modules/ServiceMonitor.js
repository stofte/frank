import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import config from '../config';

const child_process = require('child_process');
const ipc = require('electron').ipcRenderer;

@inject(HttpClient)
export default class ServiceMonitor {
    http = null;

    constructor(http) { 
        this.http = http;
        ipc.on('application-event', this.applicationEventHandler.bind(this));
    }

    applicationEventHandler(event, msg) {
        if (msg === 'close') {
            let queryCb = () => ipc.send('application-event', 'close-query-engine');
            let omniCb = () => ipc.send('application-event', 'close-omnisharp');
            this.http.fetch(this.action(config.omnisharpPort, 'stopserver')).then(omniCb, omniCb);
            this.http.fetch(this.action(config.queryEnginePort, 'stopserver')).then(queryCb, queryCb);
        }
    }

    start() {
        let slnPath = 'C:/src/frank/query-engine';
        var queryCmd = '"C:/Program Files/dotnet/dotnet.exe" run';
        let omnisharpCmd = `C:/src/frank/omnisharp/Omnisharp.exe -s ${slnPath} -p ${config.omnisharpPort}`;

        this.http.fetch(this.action(config.omnisharpPort, 'checkreadystatus'))
            .then(() => console.log(`omnisharp already running on ${config.omnisharpPort}`))
            .catch(() => this.startProcess(omnisharpCmd, { }));

        this.http.fetch(this.action(config.queryEnginePort, 'checkreadystatus'))
            .then(() => console.log(`query-engine already running on ${config.queryEnginePort}`))
            .catch(() => this.startProcess(queryCmd, { cwd: slnPath }));
    }

    startProcess(cmd, options) {
        console.log('starting process');
        child_process.exec(cmd, options, (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);            
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    }


    action(port, name) {
        return `http://localhost:${port}/${name}`;
    }
}
