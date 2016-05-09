import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class ControlPanel {
    connectionString = '';
    ea = null;
    constructor(ea) {
        this.ea = ea;
    }

    run() {
        this.ea.publish('queryConnection', this.connectionString);
    }
}
