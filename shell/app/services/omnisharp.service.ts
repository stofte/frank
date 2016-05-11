import { Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import * as uuid from 'node-uuid';
import { QueryService } from '../services/query.service';
import { EditorService } from '../services/editor.service';
import { AutocompletionQuery } from '../models/autocompletion-query';
import { AutocompletionResult } from '../models/autocompletion-result';
import { EditorChange } from '../models/editor-change';
import { Tab } from '../models/tab';
import config from '../config';
const path = electronRequire('path');

@Injectable()
export class OmnisharpService {
    private port: number = config.omnisharpPort;
    private initialized: any = {};
    private dotnetPath: string = null;
    
    constructor(
        private queryService: QueryService,
        private editorService: EditorService,
        private http: Http
    ) {
        // two levels up bla bla ...
        this.dotnetPath = path.dirname(path.dirname(__dirname)) + '/project';
        editorService.changes.subscribe(this.handleChange.bind(this));
    }
    
    private handleChange(change: EditorChange) {
        console.log('omnisharp.service.handleChange', change.newText);
    }
    
    public autocomplete(tab: number, request: AutocompletionQuery): Observable<string[]> {
        return this.http
            .post(this.action('autocomplete'), JSON.stringify(request))
            .map(res => res.json())
            .map(this.mapToCodeMirror.bind(this));
    }
    
    // when creating a new tab, this is used to generate the path used in omnisharp, to seperate it from other tabs
    // if a previously used tabId is seen, the previous fileName is returned instead.
    public randomFile(tabId: number) {
        return this.dotnetPath + '/buffer' + uuid.v4().replace(/\-/g, '') + '.cs';
    }
    
    public initializeTab(tab: Tab) {
        if (this.initialized[tab.id] == tab.connection.id) {
            console.log('already initted connection {0} for tab {1}', tab.connection.id, tab.id);
            return;
        }
        this.queryService.queryTemplate(tab.connection)
            .subscribe(result => {
                // need to update omnisharp with an initial buffer template
                // from which it can perform intellisense operations
                let json = JSON.stringify({
                    FileName: tab.fileName,
                    FromDisk: false,
                    Buffer: result.template,
                });
                console.log('template:', result.template);
                this.http.post(this.action('updatebuffer'), json)
                    .subscribe(data => {
                        if (data.status === 200) {
                            console.log('template for tab {0} using conn {1} initialized', tab.id, tab.connection.id);
                            this.initialized[tab.id] = tab.connection.id;
                        }
                    });
            });
    }
    
    private updateTab(tab: Tab, text: string) {
        let json = JSON.stringify({
            FileName: tab.fileName,
            FromDisk: false,
            Changes: [{
                NewText: text,
                StartLine: 1,
                StartColumn: 1,
                EndLine: 1,
                EndColumn: 1
            }]
        });
        this.http
            .post(this.action('updatebuffer'), json)
            .subscribe(data => {
                if (data.status === 200) {
                    console.log('template for tab {0} using conn {1} updated', tab.id, tab.connection.id);
                }
            });
    }
    
    private mapToCodeMirror(result: AutocompletionResult): string[] {
        return result.completions.map(r => r.CompletionText);
    }
    
    private action(name : string) {
        return `http://localhost:${this.port}/${name}`;
    }
}
