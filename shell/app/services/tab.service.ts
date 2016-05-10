import { Injectable } from '@angular/core'; 

@Injectable()
export class TabService {
    private id : number = 0;
    
    public get nextId() : number {
        return this.id++;
    }
}
