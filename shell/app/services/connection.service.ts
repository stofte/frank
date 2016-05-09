import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class ConnectionService {
    private _storageKey = 'connectionstrings';
    private _connections : string[] = null;
    
    constructor(private _storageService: StorageService) {
        this._connections = this._storageService.Load(this._storageKey, []);
    }
    
    public get DefaultConnection() : string {
        if (this._connections.length > 0) {
            return this._connections[0]; // todo
        }
        return null;
    }
}
