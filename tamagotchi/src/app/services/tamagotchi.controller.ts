import { Random } from '../utils/random';
import { CYCLE_DURATION_MS } from '../configuration';
import { LifeStage } from '../model/life-stage';
import { FoodType } from '../model/food-type';

export class TamagotchiController {

    private cycle = 0;

    private babyStart: number;
    private childStart: number;
    private adultStart: number;
    get lifeStage(): LifeStage {
        if (this.cycle > this.adultStart) {
            return LifeStage.Adult;
        } else if (this.cycle > this.childStart) {
            return LifeStage.Child;
        } else if (this.cycle > this.babyStart) {
            return LifeStage.Baby;
        } else {
            return LifeStage.Egg;
        }
    }

    get isAlive(): Boolean {
        return this.lifeStage !== LifeStage.Egg;
    }

    hungerMeter = 0;

    happinessMeter = 0;

    constructor(readonly name: string) {
        this.babyStart = Random.between(5, 10);
        this.childStart = Random.between(this.babyStart + 30, this.babyStart + 60);
        this.adultStart = Random.between(this.childStart + 60, this.childStart + 120);
        setInterval(() => this.step(), CYCLE_DURATION_MS);
    }

    private step() {
        this.cycle++;
        if (this.isAlive) {
            this.hungerMeter += Random.standard();
            this.happinessMeter -= Random.standard();
        }
    }

    feed(foodType: FoodType) {
        this.hungerMeter -= foodType === FoodType.Meal ? 30 : 5;
        this.happinessMeter += foodType === FoodType.Meal ? 10 : 20;
    }

}
