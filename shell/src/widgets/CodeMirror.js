import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import Mirror from 'codemirror';
import 'codemirror/lib/codemirror.css!';

@inject(EventAggregator)
export class CodeMirror {
    mirror = null;
    ea = null;

    constructor(ea) {
        this.ea = ea;
        this.ea.subscribe('queryConnection', (connectionString) => {
            this.ea.publish('queryExecute', {
                text: this.mirror.getValue(),
                connectionString
            });
        });
    }

    attached() {
        this.mirror = Mirror.fromTextArea(this.editorElement, {
            lineNumbers: true
        });
    }
}