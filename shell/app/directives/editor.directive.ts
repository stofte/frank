import { Directive, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { EditorService } from '../services/editor.service';
import * as cm from 'codemirror';

@Directive({
    selector: '[editor]'
})
export class EditorDirective {
    private current: number = null;
    editor: any;
    constructor(
        private editorService: EditorService,
        private route: Router,
        public element: ElementRef, 
        public renderer: Renderer
    ){
        this.editor = cm.fromTextArea(element.nativeElement, {
            lineNumbers: false,
            viewportMargin: Infinity
        });
        const domElm = this.editor.getWrapperElement();
        domElm.classList.toggle('form-control');
        this.editor.on('change', this.codemirrorValueChanged.bind(this));
        route.subscribe(this.routeHandler.bind(this));
    }
    
    private routeHandler(route: string) {
        const prefix = 'tab/';
        if (route.length > prefix.length && route.indexOf(prefix) === 0) {
            let routeId: number = this.current;
            try {
                routeId = parseInt(route.substring(prefix.length, prefix.length + 1), 10);
            }
            catch (exn) { }
            if (routeId !== this.current) {
                const contents = this.editorService.get(routeId);
                this.current = routeId;
                this.editor.setValue(contents);
            }
        }
    }
    
    private codemirrorValueChanged(doc : any) {
        if (this.current !== null) {
            let newValue = doc.getValue();
            this.editorService.set(this.current, newValue);            
        }
    }
}
