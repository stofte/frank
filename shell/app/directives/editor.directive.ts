import { Directive, ElementRef, Renderer, OnInit } from '@angular/core';
import { Router, RouteParams } from '@angular/router-deprecated';
import { EditorService } from '../services/editor.service';
import * as cm from 'codemirror';

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
        this.editor = cm.fromTextArea(element.nativeElement, {
            lineNumbers: false,
            viewportMargin: Infinity
        });
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
}
