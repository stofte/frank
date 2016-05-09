import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import config from '../config';

@Injectable()
export class QueryService {

    constructor(private http : Http) {
    }
}