import Dexie, { Table } from "dexie";

export interface Auth {
    id?: number;
    token: string;
}

export class IndexedDbService extends Dexie {
    
    auth!: Table<Auth, number>;
    
    constructor(){
        super('banco')
        this.version(1).stores({
            auth: '++id, token'
        })
    }
}

export const BancoLocal = new IndexedDbService();