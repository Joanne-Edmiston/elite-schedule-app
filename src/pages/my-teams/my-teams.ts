import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import { TournamentsPage } from '../tournaments/tournaments';
import { EliteApi } from '../../providers/elite-api/elite-api';
import { TeamHomePage } from '../team-home/team-home';
import { UserSettings } from '../../providers/user-settings/user-settings';

@Component({
  selector: 'page-my-teams',
  templateUrl: 'my-teams.html'
})
export class MyTeamsPage {
  /*
  favourites = [
    {
      team: { id: 800, name: 'Sharks', coach: 'Michelotti' },
      tournamentId: '89e13aa2-ba6d-4f55-9cc2-61eba6172c63',
      tournamentName: 'March Madness Tournament'
    },
    {
      team: { id: 810, name: 'Force Attack', coach: 'Michelotti' },
      tournamentId: '98c6857e-b0d1-4295-b89e-2d95a45437f2',
      tournamentName: 'Holiday Hoops Challenge'
    }
  ];*/
  favourites = [];

  constructor(
    private nav: NavController,
    private loadingController: LoadingController,
    private eliteApi: EliteApi,
    private userSettings: UserSettings
  ) {}

  ionViewDidEnter() {
    this.favourites = this.userSettings.getAllFavourites();
  }

  goToTournaments() {
    this.nav.push(TournamentsPage);
  }

  favouriteTapped($event, fav) {
    let loader = this.loadingController.create({
      content: 'Getting data...',
      dismissOnPageChange: true
    });

    loader.present();
    this.eliteApi
      .getTournamentData(fav.tournamentId)
      .subscribe(t => this.nav.push(TeamHomePage, fav.team));
  }
}
