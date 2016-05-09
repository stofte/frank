import { provide, Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from '@angular/router-deprecated';

import { MonitorService } from './services/monitor.service';
import { ConnectionService } from './services/connection.service';

import { StartPageComponent } from './components/start-page.component';
import { BufferTabComponent } from './components/buffer-tab.component';
import { ConnectionManagerComponent } from './components/connection-manager.component';

@RouteConfig([
    { path: '/start', name: 'StartPage', component: StartPageComponent },
    { path: '/tab/:id', name: 'EditorTab', component: BufferTabComponent }
])
@Component({
    selector: 'f-app',
    directives: [ConnectionManagerComponent, ROUTER_DIRECTIVES],
    template: `
    <div>
        <f-connection-manager></f-connection-manager>
        <nav>
            <a [routerLink]="['StartPage']">Start</a>
        </nav>
        <router-outlet></router-outlet>
    </div>
`
})
export class AppComponent { 
    constructor(
        private monitorService : MonitorService, 
        private connectionService: ConnectionService,
        private router : Router) {
        monitorService.start();
        
        // decide where to go
        let connection = connectionService.DefaultConnection;
        if (!connection) {
            router.navigate(['StartPage']);
        } else {
            router.navigate(['EditorTab', 0]);
        }
    }
}