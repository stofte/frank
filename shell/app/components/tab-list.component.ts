import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { TabService } from '../services/tab.service';

// https://github.com/angular/angular/issues/5318#issuecomment-157474890
@Component({
    selector: 'f-tab-list',
    directives: [ROUTER_DIRECTIVES],
    template: `
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid" *ngIf="tabsEnabled">
        <div class="navbar-header">
            <ul class="nav navbar-nav">
                <li *ngFor="let tab of tabService.tabs"
                     class="{{tabService.active.id === tab.id ? 'active' : ''}}">
                    <a [routerLink]="['EditorTab', {id: tab.id, connectionId: tab.connection.id}]">
                        Edit {{tab.id}}
                    </a>
                </li>
                <li>
                    <a (click)="newTab()" href="javascript:void(0)">new</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
`
})
export class TabListComponent {
    constructor(
        private tabService: TabService,
		private router: Router,
        private location: Location
    ) {
    }
    
    private newTab() {
		const activeConn = this.tabService.active.connection;
        const tab = this.tabService.newForeground(activeConn);
        this.router.navigate(['/EditorTab', { id: tab.id, connectionId: tab.connection.id }]);
    }
    
    private get tabsEnabled(): boolean {
        // dont show tabs on start page
        return this.location.path().indexOf('/start') === -1;
    }
}
