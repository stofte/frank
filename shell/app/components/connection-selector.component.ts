import { Component, ViewChildren, QueryList } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';
import { ConnectionService } from '../services/connection.service';
import { Connection } from '../models/connection';
import { TabService } from '../services/tab.service';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'f-connection-selector',
    directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES],
    template: `
<div class="input-group" (click)="$event.preventDefault()">
    <div class="input-group-btn btn-group" dropdown keyboardNav="true" (onToggle)="toggled($event)">
        <button id="simple-btn-keyboard-nav" type="button" class="btn btn-default" dropdownToggle>
            Connection <span class="caret"></span>
        </button>
        <ul ref="menulist" class="dropdown-menu" role="menu" aria-labelledby="simple-btn-keyboard-nav">
            <li role="menuitem" *ngFor="let conn of connectionService.connections">
                <a class="dropdown-item" href="javascript:void(0)" (click)="select(conn)">{{conn.connectionString}}</a>
            </li>
        </ul>
    </div>
    <span class="form-control">{{connectionService.get(connId).connectionString}}</span>
</div>
`
})
export class ConnectionSelectorComponent {
    private tabId: number = null;
    private connId: number = null;
    constructor(
        private connectionService: ConnectionService,
        private tabService: TabService,
        private router: Router,
        private routeParams: RouteParams
    ) {
        this.tabId = parseInt(routeParams.get('id'), 10);
        this.connId = parseInt(routeParams.get('connectionId'), 10);
    }
    
    public toggled(open: boolean):void {
        console.log('Dropdown is now: ', open);
    }
    
    private select(conn: Connection) {
        this.tabService.updateTabId(this.tabId, conn);
        console.log('selected: ', conn);
    }
}