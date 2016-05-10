import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';
import { ConnectionSelectorComponent } from './connection-selector.component';

@Component({
    selector: 'f-buffer-tab',
    directives: [ConnectionSelectorComponent],
    template: `
<div>
    <f-connection-selector></f-connection-selector>
    <p>buffer {{routeParams.get('id')}} using connection {{connectionService.get(routeParams.get('connectionId')).connectionString}}</p>
</div>
`
})
export class BufferTabComponent {
    constructor(
        private connectionService: ConnectionService, 
        private routeParams: RouteParams
    ) {
        
    }
}
