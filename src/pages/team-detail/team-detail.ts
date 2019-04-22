import { UserSettings } from './../../providers/user-settings/user-settings';
import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import { EliteApi } from '../../providers/elite-api/elite-api';

import * as _ from 'lodash';
import { GamePage } from '../game/game';
import moment from 'moment';

@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html'
})
export class TeamDetailPage {
  public allGames: any[];
  public team: any = {};
  public teamStanding: any = {};
  public games: any[];
  public tourneyData: any;
  public dateFilter: any;
  public useDateFilter: boolean;
  public isFollowing = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private userSettings: UserSettings,
    private eliteApi: EliteApi
  ) {
    this.team = this.navParams.data;
  }

  ionViewDidLoad() {
    this.team = this.navParams.data;
    this.tourneyData = this.eliteApi.getCurrentTourney();
    this.games = _.chain(this.tourneyData.games)
      .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
      .map(g => {
        let isTeam1 = g.team1Id === this.team.id;
        let opponentName = isTeam1 ? g.team2 : g.team1;
        let scoreDisplay = this.getScoreDisplay(
          isTeam1,
          g.team1Score,
          g.team2Score
        );
        return {
          gameId: g.id,
          opponent: opponentName,
          time: Date.parse(g.time),
          location: g.location,
          locationUrl: g.locationUrl,
          scoreDisplay: scoreDisplay,
          homeAway: isTeam1 ? 'vs.' : 'at'
        };
      })
      .value();
    this.teamStanding = _.find(this.tourneyData.standings, {
      teamId: this.team.id
    });
    this.allGames = this.games;
    this.useDateFilter = false;
    this.userSettings
      .isFavourite(this.team.id.toString())
      .then(value => (this.isFollowing = value));
  }

  dateChanged() {
    if (this.useDateFilter) {
      this.games = _.filter(this.allGames, g =>
        moment(g.time).isSame(this.dateFilter, 'day')
      );
    } else {
      this.games = this.allGames;
    }
  }

  getScoreDisplay(isTeam1, team1Score, team2Score) {
    if (team1Score && team2Score) {
      var teamScore = isTeam1 ? team1Score : team2Score;
      var opponentScore = isTeam1 ? team2Score : team1Score;
      var winIndicator = teamScore > opponentScore ? 'W: ' : 'L: ';
      return winIndicator + teamScore + '-' + opponentScore;
    } else {
      return '';
    }
  }

  getScoreDisplayBadgeClass(game) {
    return this.getScoreWorl(game) === 'L' ? 'danger' : 'default';
  }

  getScoreWorl(game) {
    return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }

  gameClicked($event, game) {
    let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
    this.navCtrl.parent.parent.push(GamePage, sourceGame);
  }

  toggleFollow() {
    if (this.isFollowing) {
      let confirm = this.alertController.create({
        title: 'Unfollow?',
        message: 'Are you sure you want to unfollow?',
        buttons: [
          {
            text: 'yes',
            handler: () => {
              this.isFollowing = false;
              this.userSettings.unfavouriteTeam(this.team);

              let toast = this.toastController.create({
                message: 'You have unfollowed this team',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            }
          },
          {
            text: 'no'
          }
        ]
      });
      confirm.present();
    } else {
      this.isFollowing = true;
      this.userSettings.favourteTeam(
        this.team,
        this.tourneyData.tournament.id,
        this.tourneyData.tournament.name
      );

      let toast = this.toastController.create({
        message: 'You are now following this team',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  refreshAll(refresher) {
    this.eliteApi.refreshCurrentTourney().subscribe(() => {
      refresher.complete();
      this.ionViewDidLoad();
    });
  }
}
