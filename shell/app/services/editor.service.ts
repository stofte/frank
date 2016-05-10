import { Injectable } from '@angular/core';

@Injectable()
export class EditorService {
    private buffers: any = {};
    
    public get(id: number): string {
        console.log('EditorService.get', id)
        return this.buffers[id] || '\n\n';
    }
    
    public set(id: number, text: string) {
        console.log('EditorService.set', id, text);
        this.buffers[id] = text;
    }    
}
