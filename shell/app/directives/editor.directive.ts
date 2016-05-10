import { Directive, ElementRef, Renderer } from '@angular/core';
import * as cm from 'codemirror';

@Directive({
    selector: '[editor]'
})
export class EditorDirective {

    editor: any;
    constructor(public element: ElementRef, public renderer: Renderer){
        this.editor = cm.fromTextArea(element.nativeElement, {lineNumbers: false, mode: {name: "javascript", globalVars: true}});
        console.log(this.editor.getWrapperElement().classList.toggle('form-control'));
    }
    
    attached() {
        this.editor.refresh();
    }
}