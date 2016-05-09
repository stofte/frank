import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import ServiceMonitor from './modules/ServiceMonitor';
import 'normalize.css/normalize.css!';
import './styles/basic.css!';

@inject(Router, ServiceMonitor)
export class App {
    serviceMonitor = null;
    router = null;

    constructor(router, serviceMonitor) {
        this.router = router;
        this.serviceMonitor = serviceMonitor;
        this.router.configure(config => {
            config.map([
                { name: 'start', route: ['','start'], moduleId: 'widgets/TabControl' }
            ]);
        });
        this.serviceMonitor.start();
    }

    attached() {
        console.log('attached');
    }

    configureRouter(config, router) {
        console.log('configureRouter', config, router);
    }

    get electronVersion() {
        return process.versions.electron;
    }

    get chromeVersion() {
        return process.versions.chrome;
    }

    get nodeVersion() {
        return process.versions.node;
    }
}
