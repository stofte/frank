import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';
import { TabService } from '../services/tab.service';
import { ConnectionSelectorComponent } from './connection-selector.component';

@Component({
    selector: 'f-buffer-tab',
    directives: [ConnectionSelectorComponent],
    template: `
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <p><f-connection-selector></f-connection-selector></p>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>newline</p>
            <p>buffer {{routeParams.get('id')}} using connection {{connectionService.get(routeParams.get('connectionId')).connectionString}}</p>
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
        console.log('BufferTabComponent.routerOnActivate');
    }
}
