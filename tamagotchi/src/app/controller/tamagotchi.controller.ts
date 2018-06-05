import { Random } from '../utils/random';
import { CYCLE_DURATION_MS, TIRED_ENERGY_MARK } from '../configuration';
import { LifeStage, CauseOfDeath } from '../model/life-stage';
import { FoodType } from '../model/food-type';
import { newTamagotchi, timeStep, feed, putToBed, wakeUp, startPlaying, stopPlaying, cleanPoop } from './redux/tamagotchi.actions';
import { TamagotchiState, InitialTamagotchiState, TamagotchisStates } from './redux/tamagotchi.state';
import { tamagotchiReducer } from './redux/tamagotchi.reducer';
import { NgRedux } from '@angular-redux/store';

export class TamagotchiController {

    protected intervalId;
    state: TamagotchiState;

    get isAlive(): boolean {
        return this.state.lifeStage !== LifeStage.Egg && this.state.lifeStage !== LifeStage.Dead;
    }

    get canBeFed(): boolean {
        return this.isAlive && !this.state.isSleeping && !this.state.isPlaying;
    }

    get canSleep(): boolean {
        return this.isAlive && !this.state.isPlaying;
    }

    get canPlay(): boolean {
        return this.isAlive && !this.state.isSleeping;
    }

    get canCleanPoop(): boolean {
        return this.state.poopsCount > 0;
    }

    constructor(readonly name: string, private ngRedux: NgRedux<TamagotchisStates>) {
        const babyStart = Random.between(5, 10);
        const childStart = Random.between(babyStart + 30, babyStart + 60);
        const adultStart = Random.between(childStart + 60, childStart + 120);
        const naturalDeath = Random.between(adultStart + 180, adultStart + 600);
        this.state = new InitialTamagotchiState(babyStart, childStart, adultStart, naturalDeath);
        this.dispatchNew();
        this.intervalId = setInterval(() => this.step(), CYCLE_DURATION_MS);
    }

    private step() {
        if (this.state.lifeStage === LifeStage.Dead) {
            clearInterval(this.intervalId);
        } else {
            this.ngRedux.dispatch(timeStep(this.name));
        }
    }

    updateState(newState: TamagotchiState) {
        this.state = newState;
    }

    protected dispatchNew() {
        this.ngRedux.dispatch(newTamagotchi(this.name, this.state));
    }

    feed(foodType: FoodType) {
        this.ngRedux.dispatch(feed(this.name, foodType));
    }

    putToBed() {
        this.ngRedux.dispatch(putToBed(this.name));
    }

    wakeUp() {
        this.ngRedux.dispatch(wakeUp(this.name));
    }

    startPlaying() {
        this.ngRedux.dispatch(startPlaying(this.name));
    }

    stopPlaying() {
        this.ngRedux.dispatch(stopPlaying(this.name));
    }

    cleanPoop() {
        this.ngRedux.dispatch(cleanPoop(this.name));
    }

}
