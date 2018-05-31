import { Component } from '@angular/core';
import { TamagotchiService } from '../../services/tamagotchi.service';
import { TamagotchiController } from '../../services/tamagotchi.controller';
import { ActivatedRoute, Router } from '@angular/router';
import { LifeStage } from '../../model/life-stage';
import { FoodType } from '../../model/food-type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.css']
})
export class TamagotchiComponent {

  tamagotchi: TamagotchiController;

  showVitalSigns = false;

  get lifeStage(): string {
    switch (this.tamagotchi.lifeStage) {
      case LifeStage.Egg:
        return '🥚';
      case LifeStage.Baby:
        return '👶';
      case LifeStage.Child:
        return '👦';
      case LifeStage.Adult:
        return '🧔';
      case LifeStage.Dead:
        return '👻';
    }
  }

  get awakenStatus(): string {
    if (this.tamagotchi.isAlive) {
      if (this.tamagotchi.isSleeping) {
        return '🌙';
      } else {
        return this.tamagotchi.energy > TamagotchiController.TIRED_ENERGY_MARK ? '☀️' : '😴';
      }
    } else {
      return null;
    }
  }

  get moodStatus(): string {
    if (this.tamagotchi.isAlive) {
      const hungerStatus = this.hungerStatus;
      return this.happinessStatus + (hungerStatus ? ` ${this.hungerStatus}` : '');
    } else {
      return null;
    }
  }

  private get happinessStatus(): string {
    if (this.tamagotchi.isPlaying) {
      return '⚽️';
    } else {
      const h = this.tamagotchi.happinessMeter;
      switch (true) {
        case (h > 50):
          return '😃';
        case (h > 20):
          return '🙂';
        case (h > -20):
          return '😐';
        case (h > -50):
          return '🙁';
        default:
          return '☹️';
      }
    }
  }

  private get hungerStatus(): string {
    const h = this.tamagotchi.hungerMeter;
    switch (true) {
      case (h > 40):
        return '🤤';
      case (h < -60):
        return '🤮';
      case (h < -30):
        return '🤢';
      default:
        return null;
    }
  }

  get poops(): string {
    return Array(this.tamagotchi.poopsCount).fill('💩').join('');
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    tamagotchiService: TamagotchiService,
    private snackBar: MatSnackBar
  ) {
    this.tamagotchi = tamagotchiService.get(route.snapshot.params.name);
    if (!this.tamagotchi) {
      router.navigate(['/']);
    }
  }

  onFeedMeal() {
    this.tamagotchi.feed(FoodType.Meal);
  }

  onFeedSnack() {
    this.tamagotchi.feed(FoodType.Snack);
  }

  onPutToBed() {
    this.tamagotchi.putToBed();
    if (!this.tamagotchi.isSleeping) {
      this.snackBar.open(`Woops! It looks like ${this.tamagotchi.name} didn't want to go to bed!`, null, { duration: 2000 });
    }
  }

  onWakeUp() {
    this.tamagotchi.wakeUp();
  }

  onStartPlaying() {
    this.tamagotchi.startPlaying();
  }

  onStopPlaying() {
    this.tamagotchi.stopPlaying();
  }

  onCleanPoop() {
    this.tamagotchi.cleanPoop();
  }

}
