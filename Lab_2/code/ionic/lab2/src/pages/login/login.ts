import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

   //Declaring the variables.
   email: string = "";
   password: string = "";
 
   /*
     This is constructor for login page.
   */
   constructor(public navCtrl: NavController,
     private fire: AngularFireAuth,
     private toastCtrl: ToastController) {
   }
 
   /*
     This method will call when the user clicks on login.
     In this we are validating the user details then we are logining to home page.
   */
   login() {
     var email = this.email;
     var password = this.password;
     if (this.email !== "" && this.password !== "") {
       this.fire.auth.signInWithEmailAndPassword(email, password)
         .then(res => {
           localStorage.setItem("uid", res.user.uid);
           this.navCtrl.setRoot(HomePage);
         })
         .catch(res => {
           console.log(res);
         });
     } else {
       this.presentToast("Please fill all the details and login.");
     }
   }
 
   /*
     This method will call when the user clicks on register.
     In this we are validating the user details then we are register the user in the firebase.
   */
   register() {
     var email = this.email;
     var password = this.password;
     if (this.email !== "" && this.password !== "") {
       this.fire.auth.createUserWithEmailAndPassword(email, password)
         .then(res => {
           console.log(res);
           this.presentToast("Registered Successfully.");
         });
     } else {
       this.presentToast("Please fill all the details and login.");
     }
   }
 
   /*
     This method will show the Toast messages.
   */
   presentToast(msg) {
     let toast = this.toastCtrl.create({
       message: msg,
       duration: 3000,
       position: 'top'
     });
 
     toast.onDidDismiss(() => {
       console.log('Dismissed toast');
     });
 
     toast.present();
   }

}
