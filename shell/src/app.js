import {inject} from 'aurelia-framework';
import ServiceMonitor from './modules/ServiceMonitor';
import 'normalize.css/normalize.css!';
import './styles/basic.css!';

@inject(ServiceMonitor)
export class App {
    serviceMonitor = null;

    constructor(serviceMonitor) {
        this.serviceMonitor = serviceMonitor;
        this.serviceMonitor.start();
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
