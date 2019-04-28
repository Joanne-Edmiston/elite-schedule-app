import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { EliteApi } from '../../providers/elite-api/elite-api';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  public map: any = {};

  constructor(public EliteApi: EliteApi, public navParams: NavParams) {}

  ionViewDidLoad() {
    let games = this.navParams.data;
    let tourneyData = this.EliteApi.getCurrentTourney();
    let location = tourneyData.locations[games.locationId];

    this.map = {
      lat: location.latitude,
      lng: location.longitude,
      zoom: 12,
      markerLabel: games.location
    };
  }
}
