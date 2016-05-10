import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { OverlayUiStateService } from '../services/overlay-ui-state.service';
import { ConnectionService } from '../services/connection.service';

@Component({
    selector: 'f-start-page',
    template: `
    <div>
        <p *ngIf="!connectionService.DefaultConnection">
            <a (click)="connectionsToggle()">click to open connection manager</a>
        </p>
        <p *ngIf="connectionService.DefaultConnection">
            <a (click)="blankTab()">click to open a new tab</a>
        </p>
    </div>
`    
})
export class StartPageComponent {
    constructor(
        private overlayUiStateService : OverlayUiStateService,
        private connectionService: ConnectionService,
        private router : Router
    ) {
        
    }
    
    private connectionsToggle() {
        this.overlayUiStateService.toggleConnections();
    }
    
    private blankTab() {
        this.router.navigate(["EditorTab", {id: 0}])
    }
}
