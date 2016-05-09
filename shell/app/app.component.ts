import { provide, Component } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MonitorService } from './services/monitor.service';
import { ConnectionService } from './services/connection.service';
import { OverlayUiStateService } from './services/overlay-ui-state.service';

import { StartPageComponent } from './components/start-page.component';
import { BufferTabComponent } from './components/buffer-tab.component';
import { ConnectionManagerComponent } from './components/connection-manager.component';

@RouteConfig([
    { path: '/start', name: 'StartPage', component: StartPageComponent },
    { path: '/guide', name: 'GuidePage', component: StartPageComponent },
    { path: '/tab/:id', name: 'EditorTab', component: BufferTabComponent }
])
@Component({
    selector: 'f-app',
    directives: [ConnectionManagerComponent, ROUTER_DIRECTIVES],
    template: `
    <div>
        <f-connection-manager class="main-layer {{connectionsVisible && 'layer-visible'}}"></f-connection-manager>
        <div class="main-layer {{!connectionsVisible && 'layer-visible'}}">
            <nav>
                <a [routerLink]="['StartPage']">Start</a>
            </nav>
            <router-outlet></router-outlet>
        </div>
    </div>
`
})
export class AppComponent {
    private connectionsVisible: boolean = false;
    
    constructor(
        private monitorService : MonitorService, 
        private connectionService: ConnectionService,
        private overlayUiStateService: OverlayUiStateService,
        private router : Router) {
        monitorService.start();
        
        // decide where to go
        let connection = connectionService.DefaultConnection;
        if (!connection) {
            router.navigate(['StartPage']);
        } else {
            router.navigate(['EditorTab', 0]);
        }
        
        // setup subs for toggle between overlays
        overlayUiStateService.connectionsVisible.subscribe(val => this.connectionsVisible = val);
    }
}
