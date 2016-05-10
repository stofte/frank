import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EditorDirective } from '../directives/editor.directive';
import { Router } from '@angular/router-deprecated';

@Component({
    selector: 'f-editor',
    directives: [EditorDirective],
    template: `
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <p><textarea editor></textarea></p>
        </div>
    </div>
</div>
`
}) 
export class EditorComponent {
    private current: number;
    constructor() {
    }
}
