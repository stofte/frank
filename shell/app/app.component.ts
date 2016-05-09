import { provide, Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from '@angular/router-deprecated';

import { MonitorService } from './service/monitor.service';
import { StartComponent } from './welcome/start.component';
import { TabComponent } from './editor/tab.component';

@RouteConfig([
    { path: '/start', name: 'WelcomeStart', component: StartComponent },
    { path: '/tab/:id', name: 'EditorTab', component: TabComponent }
])
@Component({
    selector: 'f-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    template: `
    <div>
        <nav>
            <a [routerLink]="['WelcomeStart']">Start</a>
        </nav>
        <router-outlet></router-outlet>
    </div>
`
})
export class AppComponent { 
    constructor(private monitorService : MonitorService, private router : Router) {
        monitorService.start();
        router.navigate(['WelcomeStart']);
    }
}
