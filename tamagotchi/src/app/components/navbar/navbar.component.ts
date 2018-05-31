import { Component, OnInit } from '@angular/core';
import { TamagotchiService } from '../../services/tamagotchi.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  names: string[] = [];

  constructor(private tamagotchiService: TamagotchiService) { }

  ngOnInit() {
    this.tamagotchiService.tamagotchisNames
      .subscribe(n => this.names.push(n));
  }

}
