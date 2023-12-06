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

  constructor( private http: HttpClient) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  getAsteroids( page: number ): Promise<Asteroid> {
    let response = lastValueFrom(this.http.get<Asteroid>(`${this.url}page=${page}&size=20&api_key=${this.DEMO_KEY}`, { responseType: "json"}));

    return response;
  }
}
