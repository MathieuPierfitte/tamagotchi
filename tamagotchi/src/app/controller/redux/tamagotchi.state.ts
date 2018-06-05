import { LifeStage, CauseOfDeath } from '../../model/life-stage';

export interface TamagotchisStates {

    tamagotchis: { [name: string]: TamagotchiState };

}

export class InitialTamagotchisStates implements TamagotchisStates {

    tamagotchis = { };

}

export interface TamagotchiState {

    cycle: number;
    lifeStage: LifeStage;
    causeOfDeath?: CauseOfDeath;
    isSleeping: boolean;
    isPlaying: boolean;
    energy: number;
    hunger: number;
    happiness: number;
    poopsCount: number;
    lifeSteps: LifeSteps;

}

export interface LifeSteps {

    babyStart: number;
    childStart: number;
    adultStart: number;
    naturalDeath: number;

}

export class InitialTamagotchiState implements TamagotchiState {

    cycle = 0;
    lifeStage = LifeStage.Egg;
    isSleeping = false;
    isPlaying = false;
    energy = 100;
    hunger = 0;
    happiness = 0;
    poopsCount = 0;
    lifeSteps: {
        babyStart: number;
        childStart: number;
        adultStart: number;
        naturalDeath: number;
    };

    constructor(
        babyStart: number,
        childStart: number,
        adultStart: number,
        naturalDeath: number
    ) {
        this.lifeSteps = {
            babyStart: babyStart,
            childStart: childStart,
            adultStart: adultStart,
            naturalDeath: naturalDeath
        };
    }

}
