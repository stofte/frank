import { Injectable } from '@angular/core';

@Injectable()
export class OverlayUiStateService {
    private _visible = false
    
    public toggle() {
        this._visible = true;
    }
}