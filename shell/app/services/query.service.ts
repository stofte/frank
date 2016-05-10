import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { Connection } from '../models/connection';
import { QueryResult } from '../models/query-result';
import { ResultPage } from '../models/result-page';
import config from '../config';

@Injectable()
export class QueryService {
    private port: number = config.queryEnginePort;
    constructor(private http : Http) {
    }
    
    public run(connection: Connection, text: string): Observable<QueryResult> {
        const result = new QueryResult();
        return this.http
            .post(this.action('executequery'), JSON.stringify({}))
            .map(this.extractData);
    }
    
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || { };
    }
    
    private action(name : string) {
        return `http://localhost:${this.port}/${name}`;
    }
}