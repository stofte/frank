import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import config from '../config';

@inject(EventAggregator, HttpClient)
export default class QueryService {
    ea = null;
    http = null;
    results = {};

    constructor(ea, http) {
        this.ea = ea;
        this.http = http;
        this.ea.subscribe('queryExecute', this.queryExecuteHandler.bind(this));
    }

    queryExecuteHandler(data) {
        this.http
            .fetch(`http://localhost:${config.queryEnginePort}/executequery`, {
                method: 'post',
                body: JSON.stringify(data)
            })
            .then(json => json.json())
            .then(data => {
                this.results = data.Results;
                this.ea.publish('queryComplete', data.connectionString);
            });
    }

    fetchLatest(connectionString) {
        return this.results;
    }
}
