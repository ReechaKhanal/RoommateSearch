import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable()
export class SidebarService {

  test = new Subject()
  constructor() {}

  private sidenav: MatSidenav | undefined;


  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public toggle(){
    if (this.sidenav){
      this.sidenav.toggle();
    }
  }
}
