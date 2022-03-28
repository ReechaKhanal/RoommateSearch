import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../navbar/sidebar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private sideNavService: SidebarService) { }

  ngOnInit(): void {
  }

  onUpdatePreferencesClick(){
    this.sideNavService.toggle()
  }

}
