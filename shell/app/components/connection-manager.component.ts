import { Component } from '@angular/core';
import { OverlayUiStateService } from '../services/overlay-ui-state.service';
import { ConnectionService } from '../services/connection.service';
import { Connection } from '../models/connection';

@Component({
    selector: 'f-connection-manager',
    template: `
<div>
    <h1>connection manager</h1>
    <p>
        <label>
            <input placeholder="Add new connectionstring" #newconnection 
                [(ngModel)]="newConnectionStringText" 
                (keyup.enter)="addNewConnection(newconnection.value)">
        </label>
    </p>
    <ul>
        <li *ngFor="let connection of connectionService.Connections">
            <div *ngIf="!connection.Editing">
                <label (dblclick)="editConnection(connection)">{{connection.ConnectionString}}</label>
                <button (click)="removeConnection(connection)">remove</button>
            </div>
            <input #editedconn
                *ngIf="connection.Editing" 
                [value]="connection.Temporary" 
                (blur)="stopEditing(connection, editedconn.value)" 
                (keyup.enter)="updateEditing(connection, editedconn.value)" 
                (keyup.escape)="cancelEditing(connection)">
        </li>
    </ul>
    <p><a (click)="closeManager()">close connection manager</a></p>
</div>
`
})
export class ConnectionManagerComponent {
    private visible : boolean;
    private newConnectionStringText : string;
    constructor(
        private overlayUiStateService : OverlayUiStateService,
        private connectionService: ConnectionService
    ) {

    }
    
    private closeManager() {
        this.overlayUiStateService.toggleConnections();
    }
    
    private addNewConnection(value: string) {
        if (value.length > 0) {
            this.connectionService.AddNewConnection(new Connection(value));
            this.newConnectionStringText = '';
        }
    }
    
    private editConnection(connection: Connection) {
        connection.Temporary = connection.ConnectionString;
        connection.Editing = true;
    }
    
    private removeConnection(connection: Connection) {
        this.connectionService.RemoveConnection(connection);
    }
    
    private stopEditing(connection: Connection, value: string) {
        connection.Temporary = value;
    }
    
    private updateEditing(connection: Connection, value: string) {
        connection.ConnectionString = value;
        this.cancelEditing(connection);
        this.connectionService.UpdateConnection(connection);
    }
    
    private cancelEditing(connection: Connection) {
        connection.Editing = false;
        connection.Temporary = null;
    }
}
