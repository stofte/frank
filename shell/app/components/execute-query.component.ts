import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { BUTTON_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { EditorService } from '../services/editor.service';
import { ConnectionService } from '../services/connection.service';
import { QueryService } from '../services/query.service';

@Component({
    selector: 'f-execute-query',
    directives: [BUTTON_DIRECTIVES],
    template: `
<button class="btn btn-primary form-control" type="button" (click)="run()">
    <span class="glyphicon glyphicon-play"></span>
</button>
`
})
export class ExecuteQueryComponent {
    
    constructor(
        private editorService: EditorService,
        private connectionService: ConnectionService,
        private queryService: QueryService,
        private routeParams: RouteParams
    ) {
        
    }
    
    private run(): void {
        const id = parseInt(this.routeParams.get('id'), 10);
        const connId = parseInt(this.routeParams.get('connectionId'), 10);
        const conn = this.connectionService.get(connId);
        const query = this.editorService.get(id);
        this.queryService.run(conn, query)
            .subscribe(result => {
                console.log('query', query, ', using', conn.connectionString, '=>', result);
            });
    }
}
