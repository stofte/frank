import { Injectable } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Connection } from '../models/connection';
import { Tab } from '../models/tab';

@Injectable()
export class TabService {
    private id : number = 0;
    public tabs: Tab[] = [];
    
    constructor(
        private router: Router
    ) {
        
    }
    
    public newForeground(connection: Connection, navigate: boolean = true): Tab {
        var tab = new Tab();
        tab.id = this.id++;
        tab.connection = connection == null ? this.tabs.find(x => x.active).connection : connection;
        this.tabs.forEach(t => t.active = false);
        tab.active = true;
        this.tabs.push(tab);
        if (navigate) {
            this.goto(tab);
        }
        return tab;
    }
    
    public updateTabId(tabId: number, connection: Connection, navigate: boolean = true): void{
        const tab = this.tabs.find(t => t.id === tabId);
        this.updateTab(tab, connection, navigate);
    }
    
    public updateTab(tab: Tab, connection: Connection, navigate: boolean = true): void{
        this.tabs.find(t => {
            if (t.id === tab.id) {
                t.connection = connection;
                this.goto(tab);
                return true;
            }
            return false;
        });
    }
    
    public get active(): Tab {
        return this.tabs.find(x => x.active);
    }
    
    private goto(tab: Tab): void {
        this.router.navigate(["EditorTab", { id: tab.id, connectionId: tab.connection.id }]);
    }
}
