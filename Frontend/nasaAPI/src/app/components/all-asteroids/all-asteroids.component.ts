import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm} from '@angular/forms';
import { Asteroid } from 'src/app/Models/Asteorids';
import { AskAPIService } from 'src/app/services/ask-api.service';

@Component({
  selector: 'app-all-asteroids',
  templateUrl: './all-asteroids.component.html',
  styleUrls: ['./all-asteroids.component.css']
})
export class AllAsteroidsComponent implements OnInit{

  asteroid: Asteroid[];
  check = true;
  init = 0;
  index = 0;
  pages: number[];
  actualPage = 0;

  constructor( private askAPIService: AskAPIService) {}

  ngOnInit(): void {
    this.asteroid = [];
    this.pages = [];
    this.actualPage = 0;
    this.reset();
  }

  async getPages(): Promise<number> {
    return this.askAPIService.getPages();
  }

  async getAsteroids(): Promise<[Asteroid]> {
    return this.askAPIService.getAsteroids(this.init);
  }

  reset() {
    this.getPages().then( (response) => {
      console.log(response)
      this.pages.length = response/20;

      for( let i = 0; i < this.pages.length; i++) {
        this.pages[i] = i;
      }

      this.actualPage = this.pages[this.index];
      console.log(this.index)
    });
    this.getAsteroids().then( (response) => {
      this.asteroid = response;
    })
  }

  openAsteroid(asteroid: Asteroid) {
    asteroid.displayAsteroid = !asteroid.displayAsteroid;
  }

  prev(index: number) {
    if(this.index > 0) {
      this.init = this.init - 20;
      this.index = this.index - 1;
      this.actualPage = this.pages[index - 1];

      this.reset();
      console.log("init = " + this.init + " / index = " + this.index )
    }
  }

  next(index: number) {
    if(this.index <= this.pages.length) {
      this.init = this.init + 20;
      this.index = this.index + 1;
      this.actualPage = this.pages[index + 1];

      this.reset();
      console.log("init = " + this.init + " / index = " + this.index )
    }
  }
}
