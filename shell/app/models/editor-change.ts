import { Tab } from './tab';

export class EditorChange {
    public tab: Tab;
    public newText: string;
    public startLine: number;
    public startColumn: number;
    public endLine: number;
    public endColumn: number;
}
