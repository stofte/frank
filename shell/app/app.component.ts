import { provide, Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from '@angular/router-deprecated';

import { MonitorService } from './service/monitor.service';
import { Start } from './welcome/start.component';

console.log(location.href);

@RouteConfig([
    { path: '/start', name: 'Start', component: Start }
])
@Component({
    selector: 'f-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    template: `
    <div>
        <nav>
            <a [routerLink]="['Start']">Start</a>
        </nav>
        <router-outlet></router-outlet>
    </div>
`
})
export class AppComponent { 
    constructor(private monitorService : MonitorService, private router : Router) {
        monitorService.start();
        router.navigate(['Start']);
    }
}
