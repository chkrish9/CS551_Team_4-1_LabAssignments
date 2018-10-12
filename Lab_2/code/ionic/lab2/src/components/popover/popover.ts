import { Component } from '@angular/core';
import { ModalController, ViewController, Modal } from 'ionic-angular';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  text: string;

  constructor(public viewCtrl: ViewController, private modalCtrl: ModalController) {
    console.log('Hello PopoverComponent Component');
    this.text = 'Hello World';
  }

  close() {
    var model: Modal = this.modalCtrl.create('LogoutPage');
    model.present();
    this.viewCtrl.dismiss();
  }

}
