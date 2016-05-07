import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import QueryService from '../modules/QueryService';

@inject(EventAggregator, QueryService)
export default class ResultPanel {
    queryService = null;
    ea = null;
    constructor(ea, queryService) {
        this.ea = ea;
        this.queryService = queryService;
        this.ea.subscribe('queryComplete', () => {
            this.output.innerHTML = JSON.stringify(queryService.fetchLatest('foo'));
        });
    }
}
