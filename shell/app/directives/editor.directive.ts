import { Directive, ElementRef, Renderer, OnInit } from '@angular/core';
import { Router, RouteParams } from '@angular/router-deprecated';
import { EditorService } from '../services/editor.service';
import 'codemirror/addon/hint/show-hint';
import * as CodeMirror from 'codemirror';

CodeMirror.registerHelper('hint', 'ajax', (mirror, callback) => {
    callback({
        list: ["foo", "bar"]
    }); 
});
CodeMirror.hint.ajax.async = true;
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
        private route: Router,
        private routeParams: RouteParams,
        public element: ElementRef, 
        public renderer: Renderer
    ){
        this.editor = CodeMirror.fromTextArea(element.nativeElement, this.editorOptions());
        this.current = parseInt(routeParams.get('tab'), 10);
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
