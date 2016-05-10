import { provide, Component } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MonitorService } from './services/monitor.service';
import { ConnectionService } from './services/connection.service';
import { TabService } from './services/tab.service';
import { OverlayUiStateService } from './services/overlay-ui-state.service';

import { StartPageComponent } from './components/start-page.component';
import { BufferTabComponent } from './components/buffer-tab.component';
import { TabListComponent } from './components/tab-list.component';
import { ConnectionManagerComponent } from './components/connection-manager.component';

@RouteConfig([
    { path: '/start', name: 'StartPage', component: StartPageComponent },
    { path: '/guide', name: 'GuidePage', component: StartPageComponent },
    { path: '/tab/:id/:connectionId', name: 'EditorTab', component: BufferTabComponent }
])
@Component({
    selector: 'f-app',
    directives: [TabListComponent, ConnectionManagerComponent, ROUTER_DIRECTIVES],
    template: `
    <div>
        <f-connection-manager class="main-layer {{connectionsVisible ? 'layer-visible' : ''}}"></f-connection-manager>
        <div class="main-layer {{connectionsVisible ? '' : 'layer-visible'}}">
            <nav>
                <f-tab-list></f-tab-list>
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
        private tabService: TabService,
        private router : Router) {
        monitorService.start();
        
        // decide where to go
        let connection = connectionService.defaultConnection;
        if (!connection) {
            router.navigate(['StartPage']);
        } else {
            // check if there are any open tabs ...
            var tab = tabService.active;
            if (!tab) {
                console.log('no previous session, open new tab using default connection');
                tab = this.tabService.newForeground(connection);    
            }
            router.navigate(['EditorTab', { id: tab.id, connectionId: tab.connection.id }]);
        }
        
        // setup subs for toggle between overlays
        overlayUiStateService.connectionsVisible.subscribe(val => {
            this.connectionsVisible = val;
        });
    }
}
