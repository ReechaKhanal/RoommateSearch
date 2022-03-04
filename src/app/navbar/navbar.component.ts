import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private sideNavService: SidebarService) { }

  ngOnInit(): void {
  }

  onProfileClick(){
    this.sideNavService.toggle();
  }

}
