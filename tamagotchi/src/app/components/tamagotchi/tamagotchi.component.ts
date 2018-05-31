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
        return 'Egg';
      case LifeStage.Baby:
        return 'Baby';
      case LifeStage.Child:
        return 'Child';
      case LifeStage.Adult:
        return 'Adult';
    }
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

}
