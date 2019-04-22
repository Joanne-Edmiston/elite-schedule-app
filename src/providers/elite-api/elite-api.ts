import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class EliteApi {
  private baseUrl = 'https://elite-schedule-app-i2-c2ad1.firebaseio.com';
  private currentTourney: any = {};
  private tourneyData: any = {};

  constructor(public http: Http) {}

  getTournaments() {
    return new Promise(resolve => {
      this.http
        .get(`${this.baseUrl}/tournaments.json`)
        .subscribe(res => resolve(res.json()));
    });
  }

  getTournamentData(tourneyId, forceRefresh: boolean = false): Observable<any> {
    if (!forceRefresh && this.tourneyData[tourneyId]) {
      this.currentTourney = this.tourneyData[tourneyId];
      console.log('** no need to make HTTP call, just retrieve the data');
      return Observable.of(this.currentTourney);
    }

    console.log('** about to make the HTTP call, just return the data');
    return this.http
      .get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`)
      .map(response => {
        this.tourneyData[tourneyId] = response.json();
        this.currentTourney = this.tourneyData[tourneyId];
        return this.currentTourney;
      });
  }

  getCurrentTourney() {
    return this.currentTourney;
  }

  refreshCurrentTourney() {
    return this.getTournamentData(this.currentTourney.tournament.id, true);
  }
}
