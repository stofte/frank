let child_process = require('child_process');
let remote = require('electron').remote;
import ajax from './ajax';

// todo teardown when quitting
export default class OmnisharpWatcher {

    omnisharpProcess = null;
    started = false;

    constructor() { 
        console.log(remote);
        // todo find some nice way
        window.onbeforeunload = this.closing.bind(this);
    }

    start() {
        let cmd = __dirname + '/omnisharp/Omnisharp.exe -s C:\\Projects\\ConsoleApp1\\ConsoleApp1.sln';
        this.omnisharpProcess = child_process.exec(cmd, (error, stdout, stderr) => {
            console.log('returned');
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);            
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
        this.started = true; // todo check property or something
        console.log(this.omnisharpProcess);
    }

    closing(event) {
        setInterval(() => {
            if (!this.started) {
                remote.getCurrentWindow().close();
            }
        }, 100);
        // todo use omnisharp-node-client
        ajax('http://localhost:2000/stopserver').then(() => {
            this.started = false;
        });
        return !this.started;
    }
}
