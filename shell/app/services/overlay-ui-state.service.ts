import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OverlayUiStateService {
    private visible = false;
    private connections: Subject<boolean> = new Subject<boolean>();
    
    constructor() {
    }
    
    public toggleConnections() {
        this.visible = !this.visible;
        this.connections.next(this.visible);
    }
    
    public get connectionsVisible() : Observable<boolean> {
        return this.connections;
    }
}
