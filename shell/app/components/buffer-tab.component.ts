import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';

@Component({
    selector: 'f-buffer-tab',
    template: `
<div>
buffer {{routeParams.get('id')}} using connection {{connectionService.get(routeParams.get('connectionId')).ConnectionString}}
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
