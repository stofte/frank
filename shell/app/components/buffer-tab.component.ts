import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';
import { TabService } from '../services/tab.service';
import { ConnectionSelectorComponent } from './connection-selector.component';
import { ExecuteQueryComponent } from './execute-query.component';

@Component({
    selector: 'f-buffer-tab',
    directives: [ExecuteQueryComponent, ConnectionSelectorComponent],
    template: `
<div class="container-fluid">
    <div class="row">
        <div class="col-md-1">
            <p><f-execute-query></f-execute-query></p>
        </div>
        <div class="col-md-11">
            <p><f-connection-selector></f-connection-selector></p>
        </div>
    </div>
</div>
`
})
export class BufferTabComponent {
    constructor(
        private connectionService: ConnectionService,
        private tabService: TabService,
        private routeParams: RouteParams
    ) {
        
    }
    
    routerOnActivate() {
        const id = parseInt(this.routeParams.get('id'), 10);
        this.tabService.routedTo(id);
    }
}
