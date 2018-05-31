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

    isSleeping = false;

    private _energy = 100;
    get energy(): number { return this._energy; }
    set energy(energy: number) { this._energy = Math.min(energy, 100); }
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
            if (this.isSleeping) {
                this.energy += Random.standard(5);
            } else {
                this.energy -= Random.standard(this.lifeStage === LifeStage.Child ? 5 : 2);
                this.happinessMeter -= Random.standard();
            }
            this.hungerMeter += Random.standard();
        }
    }

    feed(foodType: FoodType) {
        if (foodType === FoodType.Meal) {
            this.energy += 10;
            this.hungerMeter -= 30;
            this.happinessMeter += 10;
        } else {
            this.energy += 5;
            this.hungerMeter -= 5;
            this.happinessMeter += 20;
        }
    }

    putToBed() {
        if (this.energy < 40) {
            this.isSleeping = true;
        } else {
            this.happinessMeter -= 10;
        }
    }

    wakeUp() {
        if (this.energy < 75) {
            this.happinessMeter -= 30;
        }
        this.isSleeping = false;
    }

}
