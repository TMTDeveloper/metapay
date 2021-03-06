import {
  Injectable
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import 'rxjs/add/operator/map';
import {
  Observable
} from 'rxjs/Rx'


/*
  Generated class for the HttpReqProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HttpReqProvider {
  //baseurlxpay:string='http://202.158.20.141:5001/xpay-service/api/'
  baseurlxpay:string='http://202.158.20.141:5001/xpayws/rest/'
 
  baseurl: string = 'http://202.158.20.141:5001/semetapro/api/'
  baseurlmetapay: string = 'http://202.158.20.141:5001/semetapro/api/metapay/'
  constructor(public http: Http) {}

  getreq(url: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    let obs = this.http.get(this.baseurl + url,options).map(res => res.json())
    return obs;
  };

  postreq(url: string, body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    let obs = this.http.post(this.baseurl + url, body,options).map(res => res.json())
    return obs;
  };

  postreqmetapay(url: string, body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    let obs = this.http.post(this.baseurlmetapay + url, body,options).map(res => res.json())
    return obs;
  };


  postreqxpay(url: string, body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    let obs = this.http.post(this.baseurlxpay + url+body,body,options).map(res => res.json())
    return obs;
  };
}
