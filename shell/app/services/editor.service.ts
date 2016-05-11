import { Injectable } from '@angular/core';
import { EditorChange } from '../models/editor-change';
import { OmnisharpService } from './omnisharp.service';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class EditorService {
    private buffers: any = {};
    public changes: Subject<EditorChange>;
    
    constructor() {
        this.changes = new Subject<EditorChange>(); 
    }
    
    public get(id: number): string {
        return this.buffers[id] || '\n\n';
    }
    
    public set(id: number, text: string) {
        console.log('EditorService.set(text)', text);
        let change = new EditorChange();
        change.startColumn = 1;
        change.startLine = 1;
        change.endColumn = text.length;
        change.endLine = 1;
        this.changes.next(change);
        this.buffers[id] = text;
    }
}
