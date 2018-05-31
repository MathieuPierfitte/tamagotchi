import { Component, OnInit } from '@angular/core';
import { TamagotchiService } from '../../services/tamagotchi.service';
import { TamagotchiController } from '../../services/tamagotchi.controller';
import { ActivatedRoute, Router } from '@angular/router';
import { LifeStage } from '../../model/life-stage';
import { FoodType } from '../../model/food-type';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.css']
})
export class TamagotchiComponent implements OnInit {

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
    tamagotchiService: TamagotchiService
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

  ngOnInit() {
  }

}
