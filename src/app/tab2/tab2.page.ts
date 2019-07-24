import { Component } from '@angular/core';
import { Parse } from 'parse';
import { ParseConfig } from '../../app/parse.config';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  rooms: any[] = [];
  
  constructor(private storage: Storage, public alertController: AlertController) {
    this.getMyReverves();
  }
  
  ionViewDidEnter() { 
    this.getMyReverves();  
  }

  getMyReverves() {

    Parse.initialize(ParseConfig.appId, ParseConfig.javascriptKey, ParseConfig.masterKey);
    Parse.serverURL = ParseConfig.serverURL;

    var query = new Parse.Query("Reverse");
    query.include("roomRev");
    query.include("userRev");
    query.find().then((results) => {
      console.log(results);
      this.rooms = results;
    }, err => {
      console.log('Error logging in', err);
    });
    
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getMyReverves();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  removeReserve(reserve){
    Parse.initialize(ParseConfig.appId, ParseConfig.javascriptKey, ParseConfig.masterKey);
    Parse.serverURL = ParseConfig.serverURL;

    let room = reserve.attributes.roomRev;
    let dates = reserve.attributes.datesRev;
    let interval = reserve.attributes.intervalsRev;

    reserve.destroy().then((results) => {
      console.log(results);

      room.set("datesRev", this.getDatesRev(room, dates));
      room.set("intervalsRev", this.getIntervalsRev(room, interval));
      room.save().then((roomUpdate) => {
        console.log(roomUpdate);       
      }, err => {
        console.log('Error Room in', err);
      }); 
      
      this.getMyReverves(); 
    }, err => {
      console.log('Error logging in', err);
    });    
  }

  getDatesRev(room, dates){
    let datesSave = room.attributes.datesRev;
    if(datesSave != undefined)
    {
      for( var i = 0; i < datesSave.length; i++){
        for(var j = 0; j < dates.length; j++){
          if ( datesSave[i] == dates[j]) {
            datesSave.splice(i, 1);
          }
        }
      }
    }
    return datesSave;
  }

  getIntervalsRev(room, interval){
    let intervalSave = room.attributes.intervalsRev;
    if(intervalSave != undefined)
    {
      for( var i = 0; i < intervalSave.length; i++){
        for(var j = 0; j < interval.length; j++){
          if ( intervalSave[i] == interval[j]) {
            intervalSave.splice(i, 1);
          }
        }
      }
    }
    return intervalSave;
  }

  async presentAlertConfirm(reverve) {
    const alert = await this.alertController.create({
      header: 'Remover reserva!',
      message: 'Confirma <b>removeção</b> da reverva: <p><strong>'+ reverve.attributes.roomRev.attributes.name +'</strong></p><p>Em '+ reverve.attributes.datesRev +'</p>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Remover',
          cssClass: 'primary',
          handler: () => {
            console.log('Confirm Okay');
            this.removeReserve(reverve);
          }
        }
      ]
    });

    await alert.present();
  }
}
