import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Connection } from '../models/connection';

@Injectable()
export class ConnectionService {
    private storageKey = 'connectionstrings';
    private connections : Connection[] = null;
    private id : number = 0;
    
    constructor(private storageService: StorageService) {
        this.connections = this.storageService.Load(this.storageKey, []);
        this.id = this.connections.reduce((prev, curr) => Math.max(prev, curr.Id), 0);
    }
    
    public get DefaultConnection() : Connection {
        if (this.connections.length > 0) {
            return this.connections[0]; // todo
        }
        return null;
    }
    
    public get Connections() : Connection[] {
        return this.connections;
    }
    
    public AddNewConnection(conn: Connection) {
        conn.Id = this.id++;
        this.connections.push(conn);
        this.storageService.Save(this.storageKey, this.connections);
    }
    
    public RemoveConnection(conn: Connection) {
        conn.Id = this.id++;
        this.connections = this.connections.filter(x => x.Id != conn.Id);
        this.storageService.Save(this.storageKey, this.connections);
    }
    
    public UpdateConnection(conn: Connection) {
        this.connections.find(c => {
           if (c.Id === conn.Id) {
               console.log('updated conn');
               c.ConnectionString = conn.ConnectionString;
               this.storageService.Save(this.storageKey, this.connections);
               return true;
           } 
           return false;
        });
    }
}
