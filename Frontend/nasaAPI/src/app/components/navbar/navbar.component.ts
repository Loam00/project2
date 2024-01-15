import { Component } from '@angular/core';
import { Data } from './navBarData';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navData = Data;
}
