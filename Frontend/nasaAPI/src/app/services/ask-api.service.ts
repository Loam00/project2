import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Asteroid } from '../Models/Asteorids';


@Injectable({
  providedIn: 'root'
})
export class AskAPIService {

  private url = "https://api.nasa.gov/neo/rest/v1/neo/browse?"; /* + DEMO_KEY  */
  private DEMO_KEY = "GC0tZMMjbn55gkfIHCtsavveulO8YlnDOlbdwdU5";
  private urlServer = "http://localhost:3000/asteroids";

  constructor( private http: HttpClient) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  async getAsteroids(init: number): Promise<[Asteroid]> {
    let response = lastValueFrom(this.http.get<[Asteroid]>(`${this.urlServer}/${init}`, { responseType: "json"}));

    return response;
  }

  async getPages(): Promise<number> {
    let response = lastValueFrom(this.http.get<number>(`${this.urlServer}`, { responseType: 'json'}));
    return response;
  }

  async postAsteroid(object: Asteroid): Promise<Asteroid> {
    return await lastValueFrom(this.http.post<Asteroid>(`${this.urlServer}`, {object}, this.httpOptions));
  }
}
