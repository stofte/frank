import { Component } from '@angular/core';
import { EditorDirective } from '../directives/editor.directive';


@Component({
    selector: 'f-editor',
    directives: [EditorDirective],
    template: `
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <textarea editor></textarea>
        </div>
    </div>
</div>
`
}) 
export class EditorComponent {
    
}