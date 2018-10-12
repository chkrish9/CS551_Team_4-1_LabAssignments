import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QrcodePage } from './qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { IonicModule, NavController, ToastController } from 'ionic-angular';

describe('HomePage', () => {
    let comp: QrcodePage;
    let fixture: ComponentFixture<QrcodePage>;
   
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QrcodePage],
            imports: [
                NgxQRCodeModule,
                IonicModule.forRoot(QrcodePage)
            ],
            providers: [
                NavController,
                BarcodeScanner,
                ToastController
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QrcodePage);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

});
