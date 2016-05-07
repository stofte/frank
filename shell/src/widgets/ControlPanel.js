import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class ControlPanel {
    connectionString = 'Data Source=.\\sqlexpress;Integrated Security=True;Initial Catalog=Opera18500DB';
    ea = null;
    constructor(ea) {
        this.ea = ea;
    }

    run() {
        this.ea.publish('queryConnection', this.connectionString);
    }
}
