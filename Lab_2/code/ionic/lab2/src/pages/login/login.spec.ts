import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login';
import { IonicModule, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth,AngularFireAuthModule } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import {AngularFireModule} from 'angularFire2';

describe('LoginPage', () => {
  let comp: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  var config = {
    apiKey: "AIzaSyChOwtrVGatfmSocRXLl6uutvAWthStZAU",
    authDomain: "umkc-lab-1.firebaseapp.com",
    databaseURL: "https://umkc-lab-1.firebaseio.com",
    projectId: "umkc-lab-1",
    storageBucket: "umkc-lab-1.appspot.com",
    messagingSenderId: "370952627402"
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage,HomePage],
      imports: [
        AngularFireModule,
        AngularFireModule.initializeApp(config),
        IonicModule.forRoot(LoginPage)
      ],
      providers: [
        NavController,
        AngularFireAuth,
        ToastController
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => expect(comp).toBeDefined());
 
});
