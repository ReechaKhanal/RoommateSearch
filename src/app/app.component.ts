import { Component, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { SidebarService } from './navbar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RoomateSearch';
  opened = false;

  constructor(private sidenavService: SidebarService) {  }

  ngOnInit() {}

  @ViewChild('sidenav') public sidenav: MatSidenav | undefined;

  toggleOn(){
    if (this.sidenav){
      this.sidenav.toggle();
    }
  }

  ngAfterViewInit(): void {
    if (this.sidenav){
      this.sidenavService.setSidenav(this.sidenav);
    }
  }

}
