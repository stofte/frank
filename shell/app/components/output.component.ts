import { Component } from '@angular/core';
import { RouteParams, Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import { QueryService } from '../services/query.service';
import { QueryResult } from '../models/query-result';
import { ResultPage } from '../models/result-page';

@Component({
    selector: 'f-output',
    template: `
<div class="row" style="margin-bottom:10px">
    <div class="col-md-12">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default">Console</button>
            <button 
                
                *ngFor="let page of pages"
                (click)="showResult(page.index)"
                type="button" class="btn btn-default">
                {{page.text}}
            </button>
        </div>
    </div>
</div>
<div class="row" *ngIf="consoleVisible">
    <div class="col-md-12">
        <div class="well well-sm">
            <p>console</p>
        </div>
    </div>
</div>
<div class="row" *ngIf="activeResultPage > -1">
    <div class="col-md-12" *ngFor="let page of pages">
        <div *ngIf="page.index === activeResultPage">
            <table class="table table-condensed">
                <thead>
                    <tr>
                        <th *ngFor="let head of page.columns">
                            {{head}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let row of page.rows">
                        <td *ngFor="let cell of row">
                            {{cell}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
`
})
export class OutputComponent {
    tabId: number;
    connectionId: number;
    consoleVisible: boolean;
    activeResultPage: number = null;
    pages: any[] = [];
    results: any[][] = [];
    
    constructor(
        private queryService: QueryService,
        private router : Router,
        private routeParams: RouteParams
    ) {
        this.tabId = parseInt(routeParams.get('tab'), 10);
        this.connectionId = parseInt(routeParams.get('connection'), 10);
        const output = this.routeParams.get('output');
        this.consoleVisible = output === 'console';
        console.log('activeResultPage', this.activeResultPage);
        let mapper = (x: ResultPage, i) => { 
            return { text: x.title, index: i, rows: x.rows, columns: x.columns }; 
        };
        let previous = queryService.loaded(this.tabId);
        this.pages = previous.length > 0 ? previous[0].pages.map(mapper) : [];
        this.activeResultPage = parseInt(output, 10);
        queryService
            .results(this.tabId)
            .subscribe(result => {
                this.pages = result.pages.map(mapper);
            });
    }
        
    showResult(idx: number) {
        console.log('showResult', idx, this.tabId, this.connectionId);
        this.router.navigate(["EditorTab", { tab: this.tabId, connection: this.connectionId, output: idx }]);
    }
}
