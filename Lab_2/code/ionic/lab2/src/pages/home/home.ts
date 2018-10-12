import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //Declaring the variables.
  public base64Image: string = "";
  authId: string = "";
  resp:string="";
  gender:string;
  age:string;
  defaultImg:string="assets/imgs/default-img.png";

  //Constructor
  constructor(public navCtrl: NavController,
    private afStorage: AngularFireStorage,
    public http:HttpClient,
    public fireDb: AngularFireDatabase,
    private toastCtrl: ToastController,
    private camera: Camera) {
    this.authId = localStorage.getItem("uid");
  }

  /*
    This logout method this will call when user cliks on logout button. In this method we are navigating the user to login page.
  */
  logout() {
    this.navCtrl.setRoot(LoginPage);
  }

  /*
    This method will call when the user clicks on take photo button. 
    In this we are opening the camera and once user clicks the pic then we are saving the picture in firebase.
  */
  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      let push = true;
      if (this.authId !== null && push === true) {
        let ref= this.afStorage.ref(`images/${this.authId}`).putString(this.base64Image,'data_url');
        ref.task.snapshot.ref.getDownloadURL().then(data=>{
          this.getResults(data);
        });
      }

    }, (err) => {
      console.log(err);
    });
  }

  getResults(downloadURL){
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": "6c660e3adfd7446698c30e611bde5b1a"
    });
    let obj = {
      "url":downloadURL
      }
    let url = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender";
    this.http.post(url, obj, { headers: headers }).subscribe(data => {
      this.gender = "Gender : "+data[0]["faceAttributes"]["gender"];
      this.age =  "Age : "+data[0]["faceAttributes"]["age"];
    });;
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
