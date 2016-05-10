import { Component } from '@angular/core';
import { Router, RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';
import { TabService } from '../services/tab.service';

@Component({
    selector: 'f-connection-selector',
    template: `
<div>
    <select #connSelect (change)="changeConnection(connSelect)">
        <option *ngFor="let conn of connectionService.connections"
            [value]="conn.id" [selected]="connId==conn.id">{{conn.connectionString}}</option>
    </select>
</div>
`
})
export class ConnectionSelectorComponent {
    tabId: number = null;
    connId: number = null;
    constructor(
        private connectionService: ConnectionService,
        private tabService: TabService,
        private router: Router,
        private routeParams: RouteParams
    ) {
        this.tabId = parseInt(routeParams.get('id'), 10);
        this.connId = parseInt(routeParams.get('connectionId'), 10);
    }
    
    private changeConnection(select: any) {
        const id = select.options[select.selectedIndex].value;
        const connection = this.connectionService.get(id);
        this.tabService.updateTabId(this.tabId, connection);
    }
}