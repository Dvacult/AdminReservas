import { Component } from '@angular/core';
import { Parse } from 'parse';
import { ParseConfig } from '../../app/parse.config';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  reverse: number;
  users: number;
  constructor(private storage: Storage) {
    this.getNumberReverse();
    this.getNumberUsers();
  }
  
  ionViewDidEnter() { 
    this.getNumberReverse();
    this.getNumberUsers(); 
  }
  
  getNumberReverse(){
    Parse.initialize(ParseConfig.appId, ParseConfig.javascriptKey, ParseConfig.masterKey);
    Parse.serverURL = ParseConfig.serverURL;

    var query = new Parse.Query("Reverse");
    query.find().then((results) => {
      console.log(results);
      this.reverse = results.length;
    }, err => {
      console.log('Error logging in', err);
    });
  }
  
  getNumberUsers(){
    Parse.initialize(ParseConfig.appId, ParseConfig.javascriptKey, ParseConfig.masterKey);
    Parse.serverURL = ParseConfig.serverURL;

    var query = new Parse.Query("User");
    query.find().then((results) => {
      console.log(results);
      this.users = results.length;
    }, err => {
      console.log('Error logging in', err);
    });
  }
}