let child_process = require('child_process');
let remote = require('electron').remote;
import ajax from './ajax';

export default class OmnisharpWatcher {

    process = null;
    port = 2000;
    started = false;

    constructor() { 
        // todo find some nice way
        window.onbeforeunload = this.closing.bind(this);
    }

    start() {
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
    }

    closing(event) {
        setInterval(() => {
            if (!this.started) {
                remote.getCurrentWindow().close();
            }
        }, 100);
        // todo use omnisharp-node-client
        ajax(`http://localhost:${this.port}/stopserver`).then(() => {
            this.started = false;
        });
        return !this.started;
    }
}
