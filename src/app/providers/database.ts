import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { reserveSlots } from '@angular/core/src/render3/instructions';

@Injectable({
    providedIn: 'root'
})
export class DatabaseProvider {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: HttpClient) {
        this.databaseReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'billing_software.db',
                location: 'default'
            })
            .then((db: SQLiteObject) => {
                this.database = db;
                this.fillDatabase();
            });
        });
    }

    fillDatabase() {
        this.http.get('assets/billing_software.sql',{responseType: 'text'}) 
            .subscribe(sql => {             
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(data => {
                        this.databaseReady.next(true);
                        this.storage.set('database_filled', true);
                    })
                    .catch(e => {
                        console.log('errornya');
                        console.error(e);
                    });
            });
    }

    // addDeveloper(name, skill, years) {
    //     let data = [name, skill, years]
    //     return this.database.executeSql("INSERT INTO developer (name, skill, yearsOfExperience) VALUES (?, ?, ?)", data).then(data => {
    //         return data;
    //     }, err => {
    //         console.log('Error: ', err);
    //         return err;
    //     });
    // }

    getAllDevelopers() {
        return this.database.executeSql("SELECT * FROM products", []).then((data) => {
            let products = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    products.push({ id: data.rows.item(i).id, name: data.rows.item(i).name, desc: data.rows.item(i).desc });
                }
            }
            return products;
        }, err => {
            console.log('Error: ', err);
            return [];
        });
    }

    getDatabaseState() {
        return this.databaseReady.asObservable();
    }

}