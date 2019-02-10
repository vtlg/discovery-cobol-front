import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { RippleGlobalOptions } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AppGlobalOptionsService implements RippleGlobalOptions  {

  constructor(private appService: AppService) { }

  disabled: boolean = false;
}
