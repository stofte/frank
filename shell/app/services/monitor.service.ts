import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import config from '../config';

const child_process = electronRequire('child_process');
const ipc = electronRequire('electron').ipcRenderer;

@Injectable()
export class MonitorService {
    constructor(private http: Http) {
        ipc.on('application-event', this.applicationEventHandler.bind(this));
    }
    
    private applicationEventHandler(event : any, msg : string) {
        if (msg === 'close') {
            let queryCb = () => ipc.send('application-event', 'close-query-engine');
            let omniCb = () => ipc.send('application-event', 'close-omnisharp');
            this.http.get(this.action(config.omnisharpPort, 'stopserver')).subscribe(omniCb, omniCb);
            this.http.get(this.action(config.queryEnginePort, 'stopserver')).subscribe(queryCb, queryCb);
        }
    }
    
    public start() {
        console.log(config);
        let slnPath = 'C:/src/frank/project';
        let queryCmd = '"C:/Program Files/dotnet/dotnet.exe" run';
        let omnisharpCmd = `C:/src/frank/omnisharp/Omnisharp.exe -s ${slnPath} -p ${config.omnisharpPort}`;
        let dotnetCwd = 'C:/src/frank/query-engine';

        this.http.get(this.action(config.omnisharpPort, 'checkreadystatus'))
            .subscribe(
                ok => console.log(`omnisharp already running on ${config.omnisharpPort}`),
                error => this.startProcess(omnisharpCmd, { })
            );
        this.http.get(this.action(config.queryEnginePort, 'checkreadystatus'))
            .subscribe(
                ok => console.log(`query-engine already running on ${config.queryEnginePort}`),
                error => this.startProcess(queryCmd, { cwd: dotnetCwd })
            );
    }
    
    private startProcess(cmd : string, options : any) {
        console.log('starting process');
        child_process.exec(cmd, options, (error: string, stdout: string, stderr: string) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);            
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    }
    
    private action(port : number, name : string) {
        return `http://localhost:${port}/${name}`;
    }
}
