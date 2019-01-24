import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseServicoUrl: string = environment.api;
  isLog: boolean = environment.log;


  constructor() { }
}
