import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtefatoComponent } from './artefato/artefato.component';
import { ArtefatoVisualizarComponent } from './artefato/artefato-visualizar/artefato-visualizar.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'artefato/:coArtefato', component: ArtefatoVisualizarComponent  },
  { path: 'artefato', component: ArtefatoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
