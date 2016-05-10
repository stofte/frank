import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import { TabService } from '../services/tab.service';

// https://github.com/angular/angular/issues/5318#issuecomment-157474890
@Component({
    selector: 'f-tab-list',
    directives: [ROUTER_DIRECTIVES],
    template: `
<div *ngFor="let route of breadcrumbsCollection">
    <a [routerLink]="route.linkParams">
        {{route.linkParams[1].id}}
    </a>
    <a (click)="newTab()">
        new
    </a>
</div>
`
})
export class TabListComponent {
    public breadcrumbsCollection: Array<any>;
    
    constructor(
        private tabService: TabService,
        private router: Router
    ) {
		this.router.subscribe(routeUrl => {
			let instructions : any = [];
			this.router.recognize(routeUrl).then(instruction => {
                console.log('instruction', instruction);
				instructions.push(instruction);
				
				while (instruction.child) {
					instruction = instruction.child;
					instructions.push(instruction);
				}
				
				let coll : any[] = instructions
					.map((inst : any, index : any) => {
                        console.log('map', inst.component);
						return {
							displayName: inst.component.routeData.get('displayName'),
							as: inst.component.routeData.get('name'),
							terminal: inst.component.terminal,
							linkParams: this._getLinkParams(instructions, index)
						}
					});
                this.breadcrumbsCollection = coll
                    .filter(x => x.linkParams[1] && Number.isInteger(x.linkParams[1].id));
			});
		});
    }
    
    private _getLinkParams(instructions : any, until : any) {		
		let linkParams : any = [];
		instructions.forEach((item : any, index : any) => {
			let component = item.component;
			if (index <= until) {
				linkParams.push(component.routeData.get('name'));
				if (!this._isEmpty(component.params)) {
					linkParams.push(component.params);
				}
			}
		});
		return linkParams;	
	}
    
    private _isEmpty(obj : any) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
			return false;
		}
		return true;		
	}
    
    private newTab() {
        // todo
        // const connectionId = this.routeParams.get('connectionId');
        const id = this.tabService.nextId;
        this.router.navigate(['/EditorTab', { id: id, connectionId: 0 }]);
    }
}
