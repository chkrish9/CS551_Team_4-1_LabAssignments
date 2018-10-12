import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {

  qrData=null;
  generatedCode=null;
  scannedCode=null;

  constructor(public navCtrl: NavController, 
    private barcodeScanner:BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrcodePage');
  }

  generateCode(){
    this.scannedCode = null;
    this.generatedCode = this.qrData;
  }

  scanCode(){
    this.barcodeScanner.scan().then(barcodeData => {
        this.generatedCode=null;
        this.scannedCode = barcodeData.text;
    });
  }

}
