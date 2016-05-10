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
<ul class="editor-tab-list" *ngIf="tabsEnabled">
    <li *ngFor="let tab of tabService.tabs">
		<a [routerLink]="['EditorTab', {id: tab.id, connectionId: tab.connection.id}]">
			{{tab.id}} / {{tab.connection.id}}
		</a>
	</li>
	<li>
		<a (click)="newTab()">new</a>
	</li>
</ul>
`
})
export class TabListComponent {
    constructor(
        private tabService: TabService,
		private router: Router,
        private location: Location
    ) {
        console.log(location.path());
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
