import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import QueryService from '../modules/QueryService';

@inject(EventAggregator, QueryService)
export default class ResultPanel {
    queryService = null;
    ea = null;
    api = null;
    records = [];
    headers = [];
    title = '';
    constructor(ea, queryService) {
        this.ea = ea;
        this.queryService = queryService;
        this.ea.subscribe('queryComplete', () => {
            var queryResults = queryService.fetchLatest('foo');
            var tables = this.createTables(queryResults);
            this.records = tables[0].records;
            this.headers = tables[0].headers;
            this.title = tables[0].title;
            //this.output.innerHTML = JSON.stringify(queryService.fetchLatest('foo'));
        });
    }

    createTables(data) {
        return Object.keys(data).map(resultKey => {
            var resultData = data[resultKey];
            var obj = typeof(resultData) === 'object' ? resultData : { 'Value' : resultData };
            return {
                title: resultKey,
                records: Object.keys(obj).map(key => {
                    return Object.keys(obj[key]).map(innerKey => obj[key][innerKey]);
                }),
                headers: Object.keys(obj).map(key => {
                    return Object.keys(obj[key]);
                })[0],
            };
        });
    }
}
