import { Injectable } from '@angular/core';

@Injectable()
export class OverlayUiStateService {
    private visible = false
    
    public toggle() {
        this.visible = true;
    }
}