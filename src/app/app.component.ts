import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { AppService } from './shared/servicos/app.service';
import { TipoService } from './shared/servicos/tipo.service';
import { of } from 'rxjs';
import { Tipo } from './shared/modelos/tipo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-discovery';

  ngOnInit() {  }

  constructor(private appService: AppService, private tipoService: TipoService, private elRef: ElementRef) {
    this.tipoService.getListaTipo().subscribe(
      (tipos: Tipo[]) => {
        this.appService.listaTipo = tipos;
      }
    )
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(event) {
    if (this.elRef.nativeElement.contains(event.target)) {
      var id: string = event.target.id;
      this.appService.subjectMouseover.next(id);
    }
  }

  @HostListener('document:click', ['$event'])
  onMouseClick(event) {
    if (this.elRef.nativeElement.contains(event.target)) {
      var id: string = event.target.id;
      this.appService.subjectMouseclick.next(id);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {

    var height: number;
    var width: number;

    if (event.path) {
      if (event.path[1]) {
        height = event.path[1].innerHeight;
        width = event.path[1].innerWidth;
      } else {
        height = event.path[0].innerHeight;
        width = event.path[0].innerWidth;
      }
    } else {
      height = event.target.innerHeight;
      width = event.target.innerWidth;
    }

    this.appService.subjectWindowResize.next({ height: height, width: width });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    var x: number = 0;
    var y: number = 0;

    if (event.path) {
      x = event.path[1].pageXOffset;
      y = event.path[1].pageYOffset;
    } else if (event.target && event.target.scrollingElement) {
      x = event.target.scrollingElement.scrollLeft;
      y = event.target.scrollingElement.scrollTop;
    } else {
      x = event.pageX
      y = event.pageY
    }

    this.appService.subjectWindowScroll.next({ x: x, y: y });
  }
}
