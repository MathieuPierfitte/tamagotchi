import { Random } from '../utils/random';
import { CYCLE_DURATION_MS } from '../configuration';
import { LifeStage } from '../model/life-stage';
import { FoodType } from '../model/food-type';

export class TamagotchiController {

    static TIRED_ENERGY_MARK = 40;

    protected intervalId;
    private cycle = 0;

    private babyStart: number;
    private childStart: number;
    private adultStart: number;
    private naturalDeath: number;
    private isDead = false;
    private causeOfDeath?: string;
    get lifeStage(): LifeStage {
        if (this.isDead) {
            return LifeStage.Dead;
        } else if (this.cycle > this.adultStart) {
            return LifeStage.Adult;
        } else if (this.cycle > this.childStart) {
            return LifeStage.Child;
        } else if (this.cycle > this.babyStart) {
            return LifeStage.Baby;
        } else {
            return LifeStage.Egg;
        }
    }

    get isAlive(): boolean {
        return this.lifeStage !== LifeStage.Egg && this.lifeStage !== LifeStage.Dead;
    }

    isSleeping = false;
    isPlaying = false;

    private _energy = 100; // [0;100]
    get energy(): number { return this._energy; }
    set energy(energy: number) {
        if (energy <= 0) {
            this.die('exhaustion');
        } else {
            this._energy = Math.min(energy, 100);
        }
    }
    private _hungerMeter = 0; // [-100;100]
    get hungerMeter(): number { return this._hungerMeter; }
    set hungerMeter(hungerMeter: number) {
        if (hungerMeter <= -100) {
            this.die('over feeding');
        } else if (hungerMeter >= 100) {
            this.die('hunger');
        } else {
            this._hungerMeter = Math.min(Math.max(hungerMeter, -100), 100);
        }
    }
    private _happinessMeter = 0; // [-100;100]
    get happinessMeter(): number { return this._happinessMeter; }
    set happinessMeter(happinessMeter: number) {
        if (happinessMeter <= -100) {
            this.die('boredom');
        } else {
            this._happinessMeter = Math.min(happinessMeter, 100);
        }
    }
    poopsCount = 0;

    get canBeFed(): boolean {
        return this.isAlive && !this.isSleeping && !this.isPlaying;
    }
    get canSleep(): boolean {
        return this.isAlive && !this.isPlaying;
    }
    get canPlay(): boolean {
        return this.isAlive && !this.isSleeping;
    }
    get canCleanPoop(): boolean {
        return this.poopsCount > 0;
    }

    constructor(readonly name: string) {
        this.babyStart = Random.between(5, 10);
        this.childStart = Random.between(this.babyStart + 30, this.babyStart + 60);
        this.adultStart = Random.between(this.childStart + 60, this.childStart + 120);
        this.naturalDeath = Random.between(this.adultStart + 180, this.adultStart + 600);
        this.intervalId = setInterval(() => this.step(), CYCLE_DURATION_MS);
    }

    private step() {
        this.cycle++;
        if (this.cycle > this.naturalDeath) {
            this.die('natural death');
        }
        if (this.isAlive) {
            if (this.isSleeping) {
                this.energy += Random.standard(5);
                this.isSleeping = !this.spontaneousWakeUp();
            } else if (this.isPlaying) {
                this.energy -= Random.standard(this.lifeStage === LifeStage.Child ? 6 : 3);
                this.happinessMeter += Random.standard(5);
                this.isPlaying = this.keepPlaying();
            } else {
                this.energy -= Random.standard(this.lifeStage === LifeStage.Child ? 4 : 2);
                this.happinessMeter -= Random.standard();
                this.isSleeping = this.fallAsleep();
                if (Random.boolean(-this.hungerMeter / 5)) {
                    this.poopsCount++;
                }
            }
            this.hungerMeter += Random.standard(this.isPlaying ? 2 : 1);
            this.happinessMeter -= this.poopsCount / 2;
            this.energy -= Math.max(this.hungerMeter / 50, 0);
        }
    }

    private spontaneousWakeUp(): boolean {
        return Random.boolean((this.energy - 80) * 2);
    }

    private fallAsleep(): boolean {
        return Random.boolean((30 - this.energy) * 2);
    }

    private keepPlaying(): boolean {
        return Random.boolean(90);
    }

    private die(causeOfDeath: string) {
        clearInterval(this.intervalId);
        this.isDead = true;
        this.causeOfDeath = causeOfDeath;
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
        if (this.energy < TamagotchiController.TIRED_ENERGY_MARK) {
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

    startPlaying() {
        this.isPlaying = true;
    }

    stopPlaying() {
        this.happinessMeter -= 15;
        this.isPlaying = false;
    }

    cleanPoop() {
        this.poopsCount--;
    }

}
