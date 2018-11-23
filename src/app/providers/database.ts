import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { reserveSlots } from '@angular/core/src/render3/instructions';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
    providedIn: 'root'
})
export class DatabaseProvider {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor(
        private webview: WebView,
        public sqlitePorter: SQLitePorter, 
        private storage: Storage, 
        private sqlite: SQLite, 
        private platform: Platform, 
        private http: HttpClient
        ){
        this.databaseReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'billing_software.db',
                location: 'default'
            })
            .then((db: SQLiteObject) => {
                this.database = db;
                this.storage.get('database_filled').then(val => {
                    if (val) {
                        this.databaseReady.next(true);
                    } else {
                        this.fillDatabase();
                    }
                });
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

    insert(table, model) {
        let keys = Object.keys(model);
        let queries = this.createInsertRow(table, model);
        
        return this.database.executeSql(queries.string_query, queries.values).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    update(table, model, id){
        let keys = Object.keys(model);
        let queries = this.createUpdateRow(table, model, id);
        
        return this.database.executeSql(queries.string_query, queries.values).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    get(table, id){
        return this.database.executeSql('SELECT * FROM '+table+' WHERE id= ?', [id]).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    delete(table, id){
        return this.database.executeSql('DELETE FROM '+table+' WHERE id= ?', [id]).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    getAllProducts() {
        return this.database.executeSql("select * from products", []).then((data) => {
            let products = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    products.push(data.rows.item(i));
                }
            }
            return products;
        }, err => {
            console.log('Error: ', err);
            return [];
        });
    }

    createInsertRow(tablName, model): any {
        let result = {
            string_query: '',
            values: []
        }        
        let arrColumns = Object.keys(model);
        let separates = [];

        arrColumns.forEach(key => {
            result.values.push(model[key]);
            separates.push('?');
        });

        result.string_query = 'INSERT INTO '+tablName+ ' ( '+arrColumns.join(',')+' ) VALUES ('+separates.join()+')';
        return result;
    }

    createUpdateRow(tablName, model, id): any {
        let result = {
            string_query: '',
            values: []
        }        
        let arrColumns = Object.keys(model);
        let updateParams = [];

        arrColumns.forEach(key => {
            updateParams.push(key+'=?');
            result.values.push(model[key]);
        });

        result.values.push(id);
        result.string_query = 'UPDATE '+tablName+' SET '+updateParams.join(',')+' WHERE id=?';
        return result;
    }

    getDatabaseState() {
        return this.databaseReady.asObservable();
    }

   

}