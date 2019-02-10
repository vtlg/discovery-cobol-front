import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtefatoComponent } from './artefato/artefato.component';
import { ArtefatoVisualizarComponent } from './artefato/artefato-visualizar/artefato-visualizar.component';
import { PesquisaAvancadaComponent } from './pesquisa-avancada/pesquisa-avancada.component';
import { ArtefatoEditarComponent } from './artefato/artefato-editar/artefato-editar.component';
import { ArtefatoIncluirComponent } from './artefato/artefato-incluir/artefato-incluir.component';
import { InterfaceComponent } from './interface/interface.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'artefato/incluir', component: ArtefatoIncluirComponent  },
  { path: 'artefato/:coArtefato/editar', component: ArtefatoEditarComponent  },
  { path: 'artefato/:coArtefato', component: ArtefatoVisualizarComponent  },
  { path: 'artefato', component: ArtefatoComponent },
  { path: 'interface', component: InterfaceComponent },
  { path: 'pesquisar', component: PesquisaAvancadaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
