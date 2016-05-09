import { Component } from '@angular/core';
import { OverlayUiStateService } from '../services/overlay-ui-state.service';

@Component({
    selector: 'f-start-page',
    template: `
    <div>
        <p>start by adding a connection.</p>
        <p><a (click)="connectionsToggle()">click to open connection manager</a></p>
    </div>
`    
})
export class StartPageComponent {
    constructor(
        private overlayUiStateService : OverlayUiStateService
    ) {
        
    }
    
    connectionsToggle() {
        this.overlayUiStateService.toggleConnections();
    }
}
