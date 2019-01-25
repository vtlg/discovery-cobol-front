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
import { ArtefatoComponent } from './artefato/artefato.component';

import { ArtefatoVisualizarComponent } from './artefato/artefato-visualizar/artefato-visualizar.component';
import { DescricaoArtefatoPipe } from './shared/pipes/descricao-artefato.pipe';
import { ArtefatoDiagramaTreeComponent } from './artefato/artefato-visualizar/artefato-diagrama-tree/artefato-diagrama-tree.component';
import { TipoService } from './shared/servicos/tipo.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ArtefatoComponent,
    ArtefatoVisualizarComponent,
    DescricaoArtefatoPipe,
    ArtefatoDiagramaTreeComponent,
    
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
  providers: [AppService,LoggerService,TipoService],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
