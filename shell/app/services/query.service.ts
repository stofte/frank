import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { union, find, values } from 'lodash';
import { Connection } from '../models/connection';
import { QueryResult } from '../models/query-result';
import { ResultPage } from '../models/result-page';
import config from '../config';

@Injectable()
export class QueryService {
    private port: number = config.queryEnginePort;
    private subs: Subject<QueryResult>[] = [];
    constructor(private http : Http) {
    }
    
    public run(connection: Connection, text: string)  {
        const json = JSON.stringify({
            connectionString: connection.connectionString,
            text: text
        });
        const result = new QueryResult();
        const f: (value: any, int: number) => QueryResult = this.extractQueryResult.bind(this);
        this.http
            .post(this.action('executequery'), json)
            .map(f)
            .subscribe(result => {
                console.log('run => ', result, this.subs.length);
            });
    }
    
    public results(tabId: number): Subject<QueryResult> {
        let sub = new Subject<QueryResult>();
        this.subs.push(sub);
        return null;
    }
    
    private extractQueryResult(res: Response): QueryResult {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let result = new QueryResult();
        let body = res.json();
        // todo need smarter dumper code in query-engine
        Object.keys(body.Results).forEach(key => {
            const raw = body.Results[key];
            const page = this.transformSet(raw);
            page.title = key;
            result.pages.push(page);
        });
        return result;
    }
    
    private transformSet(data: any[]): ResultPage {
        var page = new ResultPage();
        let cols: string[] = [];
        let rows: any[] = [];
        data.forEach(row => {
            cols = union(Object.keys(row), cols);
            // this also assumes all objects have same lay
            rows.push(values(row));
        });
        page.columns = cols;
        page.rows = rows;
        return page;
    }
    
    private action(name : string) {
        return `http://localhost:${this.port}/${name}`;
    }
}