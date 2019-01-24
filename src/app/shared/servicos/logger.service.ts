import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private appService: AppService) { }

  log(msg: any) {
    if (this.appService.isLog) {
      console.log(msg);
    }
  }
  
  warn(msg: any) {
    if (this.appService.isLog) {
      console.log(msg);
    }
  }

  error(msg: any) { console.error(msg); }

}
