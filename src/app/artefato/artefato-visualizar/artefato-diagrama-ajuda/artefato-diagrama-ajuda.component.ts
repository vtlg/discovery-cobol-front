import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-artefato-diagrama-ajuda',
  templateUrl: './artefato-diagrama-ajuda.component.html',
  styleUrls: ['./artefato-diagrama-ajuda.component.css']
})
export class ArtefatoDiagramaAjudaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ArtefatoDiagramaAjudaComponent>) { }

  ngOnInit() {
  }

}
