import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { BUTTON_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { EditorService } from '../services/editor.service';

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
        private routeParams: RouteParams
    ) {
        
    }
    
    private run(): void {
        const id = this.routeParams.get('id');
        const query = this.editorService.get(id);
        console.log('run current', id, '=>', query);
    }
}