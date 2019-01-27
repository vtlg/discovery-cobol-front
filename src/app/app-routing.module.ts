import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtefatoComponent } from './artefato/artefato.component';
import { ArtefatoVisualizarComponent } from './artefato/artefato-visualizar/artefato-visualizar.component';
import { PesquisaAvancadaComponent } from './pesquisa-avancada/pesquisa-avancada.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'artefato/:coArtefato', component: ArtefatoVisualizarComponent  },
  { path: 'artefato', component: ArtefatoComponent },
  { path: 'pesquisar', component: PesquisaAvancadaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
