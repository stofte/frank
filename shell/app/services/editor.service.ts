import { Injectable } from '@angular/core';

@Injectable()
export class EditorService {
    private buffers: any = {};
    
    public get(id: number): string {
        return this.buffers[id] || '\n\n';
    }
    
    public set(id: number, text: string) {
        this.buffers[id] = text;
    }    
}
