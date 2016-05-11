import { Injectable} from '@angular/core';
import { Http } from '@angular/http';
import config from '../config';

@Injectable()
export class OmnisharpService {
    private port: number = config.omnisharpPort;
    constructor(
        private http: Http
    ) {
        
    }
    
    
    
    public autocomplete(tab: number) {
        
    }
    
    private initializeTab() {
        
    }
    
    private updateTab() {
        
    }
}
