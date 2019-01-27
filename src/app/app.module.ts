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
import {MatFormFieldModule} from '@angular/material/form-field';


import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { ArtefatoComponent } from './artefato/artefato.component';

import { ArtefatoVisualizarComponent } from './artefato/artefato-visualizar/artefato-visualizar.component';
import { DescricaoArtefatoPipe } from './shared/pipes/descricao-artefato.pipe';
import { ArtefatoDiagramaTreeComponent } from './artefato/artefato-visualizar/artefato-diagrama-tree/artefato-diagrama-tree.component';
import { TipoService } from './shared/servicos/tipo.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PesquisaAvancadaComponent } from './pesquisa-avancada/pesquisa-avancada.component';
import { PesquisaAvancadaListaComponent } from './pesquisa-avancada/pesquisa-avancada-lista/pesquisa-avancada-lista.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ArtefatoComponent,
    ArtefatoVisualizarComponent,
    DescricaoArtefatoPipe,
    ArtefatoDiagramaTreeComponent,
    PesquisaAvancadaComponent,
    PesquisaAvancadaListaComponent,
    
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
    MatInputModule,
    MatSidenavModule,
    MatGridListModule,
    //A11yModule,
    //CdkTableModule,
    //CdkTreeModule,
    //DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FlexLayoutModule 
    //ScrollingModule,
  ],
  providers: [AppService,LoggerService,TipoService],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
