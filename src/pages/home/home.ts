import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import {
  DecimalPipe
} from '@angular/common';
import {
  HttpReqProvider
} from '../../providers/http-req/http-req';
import {
  AuthSingletonProvider
} from '../../providers/auth-singleton/auth-singleton';
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from '@ionic-native/barcode-scanner';
import moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  authInfo: any;
  loading: any;
  pin: string;
  options: BarcodeScannerOptions;
  results: any;





  showloading(msg ? ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please Wait...'
    });
  }

  showalert(msg, title) {
    let alert = this.alertctrl.create({
      title: title,
      subTitle: msg,
      buttons: [{
        text: 'Ok',
        role: 'ok',
        handler: () => {}
      }]
    });


    alert.present();

  }

  showPrompt(tran) {
    let prompt = this.alertctrl.create({
      title: 'PIN',
      message: "Enter Your PIN",
      inputs: [{
        name: 'PIN',
        placeholder: '123456',
        type: 'password',
        max: 6,
        min: 6
      }, ],
      buttons: [{
          text: 'Confirm',
          handler: data => {
            this.pin = data.PIN;
            this.scanSync();
          }
        },
        {
          text: 'Cancel',
          handler: data => {}
        }

      ]
    });
    prompt.present();
  }

  constructor(public navCtrl: NavController, public alertctrl: AlertController, private decimalPipe: DecimalPipe, public httpreq: HttpReqProvider, public auth: AuthSingletonProvider, public loadingCtrl: LoadingController, private barcode: BarcodeScanner, public modalCtrl: ModalController) {
    this.authInfo = this.auth.authInfo;
  }





  showalertsubmit(msg) {
    let alert = this.alertctrl.create({
      title: 'NOTIFICATION',
      subTitle: msg,
      buttons: [{
        text: 'Ok',
        role: 'ok',
        handler: () => {}
      }]
    });

    alert.present();

  }



  //--------------------------------//

  taskType: string = "generate";

  selectedamount: any = 0;
  selectedamountstr: string = '';
  keterangan: string = '';

  openModal() {
    let myModal = this.modalCtrl.create(GenerateqrPage, {
      data: {
        selectedamount: this.selectedamount,
        keterangan: this.keterangan,
        accountnumberto: this.authInfo.accountno
      }
    });
    myModal.present();
  }

  checkForm() {
    if (this.selectedamount == 0) {
      this.showalertsubmit("HARAP ISI JUMLAH TRANSAKSI");
    } else if (this.selectedamount !== 0) {
      this.openModal();
    }
  }


  scanQR() {
    this.showPrompt('scan');
  }

  scanSync() {
    this.barcode.scan({
      resultDisplayDuration: 0
    }).then((barcodeData) => {
      this.results = null
      this.results = JSON.parse(barcodeData.text);
      if (barcodeData.text.length > 0) {


        this.QRscanservice();
      }

    }, (err) => {

    });
  }

  QRscanservice() {
    var params = {
      xtoken: this.authInfo.token,
      xusername: this.authInfo.username,
      xaccountnumber: this.authInfo.accountno,
      xaccountnumberto: this.results.data.accountnumberto,
      xnominal: this.results.data.selectedamount,
      xketerangan: this.results.data.keterangan,
      xtranfrom: 'M',
      xlocation: this.authInfo.longlat,
      xpin: this.pin
    }

    var query = "";
    for (let key in params) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }

    this.showloading();
    this.loading.present();
    this.httpreq.postreqmetapay("payment?", query)
      .subscribe((response) => {

          if (response.STATUS == "OK") {
            this.loading.dismiss();
            this.showalert("TRANSAKSI BERHASIL", 'Notification');


          } else if (response.STATUS != "OK") {
            this.loading.dismiss();
            this.showalert(response.MESSAGE, 'Notification');

          }
        }, (error) => {
          this.loading.dismiss();

          this.showalert("KONEKSI BERMASALAH, HARAP ULANGI BEBERAPA SAAT LAGI", 'Notification');
        }

      )
  }

  getCurrency(amount: any) {
    return this.decimalPipe.transform(amount, '1.2-2');
  }


  onChangePrice(evt) {
    this.selectedamount = evt.split(",").join(" ");
    this.selectedamount = this.selectedamount.split(".").join(" ");
    this.selectedamount = this.selectedamount.replace(" ", "");
    if (this.selectedamount != '') {
      this.selectedamountstr = this.getCurrency(this.selectedamount)

    }
  }
  onPriceUp(evt) {
    this.selectedamount = evt.split(",").join(" ");
    this.selectedamount = this.selectedamount.split(".").join(" ");
    this.selectedamount = this.selectedamount.replace(" ", "");
    this.selectedamountstr = this.selectedamount;
  }
  isnan(value) {
    if (isNaN(value)) {
      return true
    } else {
      return false
    }
  }



}



@Component({
  selector: 'page-qr',
  templateUrl: 'generateqr.html'
})
export class GenerateqrPage {

  data: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.data = this.navParams.get('data');
  }
  valueQr = (x) => {
    let y = {
      data: this.data
    }

    return JSON.stringify(y);
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
