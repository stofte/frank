export class Connection {
    public Id : number; 
    public Editing = false;
    public ConnectionString : string = null;
    public Temporary : string;
    constructor(connectionString: string) {
        this.ConnectionString = connectionString;
    }
}