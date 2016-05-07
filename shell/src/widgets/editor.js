import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css!';

export class Editor {
    mirror = null;

    attached() {
        this.mirror = CodeMirror.fromTextArea(this.editorElement, {
            lineNumbers: true
        });
    }
}