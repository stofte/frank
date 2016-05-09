import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class ConnectionService {
    private storageKey = 'connectionstrings';
    private connections : string[] = null;
    
    constructor(private storageService: StorageService) {
        this.connections = this.storageService.Load(this.storageKey, []);
    }
    
    public get DefaultConnection() : string {
        if (this.connections.length > 0) {
            return this.connections[0]; // todo
        }
        return null;
    }
}
