import { Connection } from './connection';

export class Tab {
    public id: number;
    public connection: Connection;
    public title: string;
    public active: boolean;
    public output: any;
}
