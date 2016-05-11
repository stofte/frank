import { Directive, ElementRef, Renderer, OnInit } from '@angular/core';
import { Router, RouteParams } from '@angular/router-deprecated';

import { EditorService } from '../services/editor.service';
import { TabService } from '../services/tab.service';
import { OmnisharpService } from '../services/omnisharp.service';
import { AutocompletionQuery } from '../models/autocompletion-query';
import { AutocompletionResult } from '../models/autocompletion-result';

import 'codemirror/addon/hint/show-hint';
import * as CodeMirror from 'codemirror';

let onetimeBullshit = false;

CodeMirror.commands.autocomplete = function(cm) {
    cm.showHint({ hint: CodeMirror.hint.ajax });
};

var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";

@Directive({
    selector: '[editor]'
})
export class EditorDirective implements OnInit {
    private current: number = null;
    private textContent: string = null;
    editor: any;
    constructor(
        private editorService: EditorService,
        private omnisharpService: OmnisharpService,
        private tabService: TabService,
        private route: Router,
        private routeParams: RouteParams,
        public element: ElementRef, 
        public renderer: Renderer
    ){
        this.current = parseInt(routeParams.get('tab'), 10);
        // need the service injected, even if this should be static
        if (!onetimeBullshit) {
            onetimeBullshit = true;
            CodeMirror.registerHelper('hint', 'ajax', (mirror, callback) => {
                let tab = this.tabService.get(mirror._tab);
                let cur = mirror.getCursor();
                let range = mirror.findWordAt(cur);
                let fragment = mirror.getRange(range.anchor, range.head);
                let request = new AutocompletionQuery();
                request.fileName = tab.fileName;
                request.column = 4;
                request.line = 1;
                omnisharpService
                    .autocomplete(mirror._tabId, request)
                    .subscribe(callback);
            });
            CodeMirror.hint.ajax.async = true;
            
        }
        this.editor = CodeMirror.fromTextArea(element.nativeElement, this.editorOptions());
        this.editor._tab = this.current;
        const contents = editorService.get(this.current);
        this.editor.setValue(contents);
        const domElm = this.editor.getWrapperElement();
        domElm.classList.toggle('form-control');
        this.editor.on('change', this.codemirrorValueChanged.bind(this));
    }
        
    private codemirrorValueChanged(doc : any) {
        let newValue = doc.getValue();
        this.editorService.set(this.current, newValue);
    }
    
    ngOnInit() {
        this.editor.refresh();
    }
    
    
    
    private editorOptions() {
        return {
            lineNumbers: false,
            matchBrackets: true,
            viewportMargin: Infinity,
            showCursorWhenSelecting: true,
            mode: 'text/x-csharp'
        }
    }
}
