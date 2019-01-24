import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms'

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './shared/componentes/header/header.component';

import { AppService } from './shared/servicos/app.service'
import { LoggerService } from './shared/servicos/logger.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule ,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule
  ],
  providers: [AppService,LoggerService,],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
