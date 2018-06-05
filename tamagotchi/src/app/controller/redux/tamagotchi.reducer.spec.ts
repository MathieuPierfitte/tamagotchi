import { TestBed, inject } from '@angular/core/testing';

import { tamagotchiReducer } from './tamagotchi.reducer';
import { InitialTamagotchisStates, InitialTamagotchiState, TamagotchisStates, TamagotchiState } from './tamagotchi.state';
import { newTamagotchi, timeStep, feed, putToBed, wakeUp, startPlaying, stopPlaying, cleanPoop } from './tamagotchi.actions';
import { FoodType } from '../../model/food-type';
import { deepMerge } from '../../utils/deep';
import { LifeStage, CauseOfDeath } from '../../model/life-stage';

describe('TamagotchiReducer', () => {
    const defaultName = 'Default Tamagotchi';
    const lowVitalsName = 'Low Vitals Tamagotchi';
    let initialStates: TamagotchisStates;
    beforeEach(() => {
        initialStates = tamagotchiReducer(
            new InitialTamagotchisStates(),
            newTamagotchi(defaultName, new InitialTamagotchiState(1, 2, 3, 4)));
        initialStates = tamagotchiReducer(
            initialStates,
            newTamagotchi(lowVitalsName, new InitialTamagotchiState(1, 2, 3, 4)));
        initialStates = deepMerge({}, initialStates, { tamagotchis: { [lowVitalsName]: {
            energy: 5,
            happiness: -95,
            hunger: -95
        } } });
    });

    it('can create a new Tamagotchi', () => {
        const name = 'New Tamagotchi';

        const newState = tamagotchiReducer(
            new InitialTamagotchisStates(),
            newTamagotchi(name, new InitialTamagotchiState(1, 2, 3, 4)));

        expect(newState.tamagotchis[name]).not.toBeNull();
    });

    it('can increment cycle on a time step', () => {
        const initialCycle = initialStates.tamagotchis[defaultName].cycle;

        const newCycle = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName].cycle;

        expect(newCycle).toBe(initialCycle + 1);
    });

    it('can decrease energy on a time step', () => {
        const tamagotchi = initialStates.tamagotchis[defaultName];
        tamagotchi.lifeStage = LifeStage.Baby;
        const initialEnergy = tamagotchi.energy;

        const newEnergy = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName].energy;

        expect(newEnergy).toBeLessThan(initialEnergy);
    });

    it('can increase hunger on a time step', () => {
        const tamagotchi = initialStates.tamagotchis[defaultName];
        tamagotchi.lifeStage = LifeStage.Baby;
        const initialHunger = tamagotchi.hunger;

        const newHunger = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName].hunger;

        expect(newHunger).toBeGreaterThan(initialHunger);
    });

    it('can decrease happiness on a time step', () => {
        const tamagotchi = initialStates.tamagotchis[defaultName];
        tamagotchi.lifeStage = LifeStage.Baby;
        const initialHappiness = tamagotchi.happiness;

        const newHappiness = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName].happiness;

        expect(newHappiness).toBeLessThan(initialHappiness);
    });

    it('can increment energy by 10 when feeding a meal', () => {
        const initialEnergy = initialStates.tamagotchis[lowVitalsName].energy;

        const newEnergy = tamagotchiReducer(initialStates, feed(lowVitalsName, FoodType.Meal))
            .tamagotchis[lowVitalsName].energy;

        expect(newEnergy).toBe(initialEnergy + 10);
    });

    it('can decrease hunger by 30 when feeding a meal', () => {
        const initialHunger = initialStates.tamagotchis[defaultName].hunger;

        const newHunger = tamagotchiReducer(initialStates, feed(defaultName, FoodType.Meal))
            .tamagotchis[defaultName].hunger;

        expect(newHunger).toBe(initialHunger - 30);
    });

    it('can increment happiness by 10 when feeding a meal', () => {
        const initialHappiness = initialStates.tamagotchis[lowVitalsName].happiness;

        const newHappiness = tamagotchiReducer(initialStates, feed(lowVitalsName, FoodType.Meal))
            .tamagotchis[lowVitalsName].happiness;

        expect(newHappiness).toBe(initialHappiness + 10);
    });

    it('can increment energy by 5 when feeding a snack', () => {
        const initialEnergy = initialStates.tamagotchis[lowVitalsName].energy;

        const newEnergy = tamagotchiReducer(initialStates, feed(lowVitalsName, FoodType.Snack))
            .tamagotchis[lowVitalsName].energy;

        expect(newEnergy).toBe(initialEnergy + 5);
    });

    it('can decrease hunger by 5 when feeding a snack', () => {
        const initialHunger = initialStates.tamagotchis[defaultName].hunger;

        const newHunger = tamagotchiReducer(initialStates, feed(defaultName, FoodType.Snack))
            .tamagotchis[defaultName].hunger;

        expect(newHunger).toBe(initialHunger - 5);
    });

    it('can increment happiness by 20 when feeding a snack', () => {
        const initialHappiness = initialStates.tamagotchis[lowVitalsName].happiness;

        const newHappiness = tamagotchiReducer(initialStates, feed(lowVitalsName, FoodType.Snack))
            .tamagotchis[lowVitalsName].happiness;

        expect(newHappiness).toBe(initialHappiness + 20);
    });

    it('can put to bed when Tamagotchi is tired', () => {
        expect(initialStates.tamagotchis[lowVitalsName].isSleeping).toBeFalsy();

        const newIsSleeping = tamagotchiReducer(initialStates, putToBed(lowVitalsName))
            .tamagotchis[lowVitalsName].isSleeping;

        expect(newIsSleeping).toBeTruthy();
    });

    it('canNOT put to bed when Tamagotchi is full of energy', () => {
        const initialHappiness = initialStates.tamagotchis[defaultName].happiness;

        const tamagotchi = tamagotchiReducer(initialStates, putToBed(defaultName))
            .tamagotchis[defaultName];

        expect(tamagotchi.isSleeping).toBeFalsy();
    });

    it('can lower the happiness of the Tamagotchi by trying to put him to bed when he is full of energy', () => {
        const initialHappiness = initialStates.tamagotchis[defaultName].happiness;

        const newHappiness = tamagotchiReducer(initialStates, putToBed(defaultName))
            .tamagotchis[defaultName].happiness;

        expect(newHappiness).toBe(initialHappiness - 10);
    });

    it('can wake up a Tamagotchi full of energy', () => {
        initialStates.tamagotchis[defaultName].isSleeping = true;

        const newIsSleeping = tamagotchiReducer(initialStates, wakeUp(defaultName))
            .tamagotchis[defaultName].isSleeping;

        expect(newIsSleeping).toBeFalsy();
    });

    it('can wake up a Tamagotchi below 75 of energy', () => {
        initialStates.tamagotchis[lowVitalsName].isSleeping = true;

        const newIsSleeping = tamagotchiReducer(initialStates, wakeUp(lowVitalsName))
            .tamagotchis[lowVitalsName].isSleeping;

        expect(newIsSleeping).toBeFalsy();
    });

    it('can lower the hapiness of the Tamagochi by waking him up when his energy is below 75', () => {
        const lowVitalsTamagotchi = initialStates.tamagotchis[lowVitalsName];
        lowVitalsTamagotchi.isSleeping = true;
        const initialHappiness = lowVitalsTamagotchi.happiness;

        const newHappiness = tamagotchiReducer(initialStates, wakeUp(lowVitalsName))
            .tamagotchis[lowVitalsName].happiness;

        expect(newHappiness).toBe(initialHappiness - 30);
    });

    it('can make a Tamagotchi play', () => {
        expect(initialStates.tamagotchis[defaultName].isPlaying).toBeFalsy();

        const newIsPlaying = tamagotchiReducer(initialStates, startPlaying(defaultName))
            .tamagotchis[defaultName].isPlaying;

        expect(newIsPlaying).toBeTruthy();
    });

    it('can make a Tamagotchi stop playing', () => {
        initialStates.tamagotchis[defaultName].isPlaying = true;

        const newIsPlaying = tamagotchiReducer(initialStates, stopPlaying(defaultName))
            .tamagotchis[defaultName].isPlaying;

        expect(newIsPlaying).toBeFalsy();
    });

    it('can lower the happiness of a Tamagotchi by forcing him to stop playing', () => {
        const tamagotchi = initialStates.tamagotchis[defaultName];
        tamagotchi.isPlaying = true;
        const initialHappiness = tamagotchi.happiness;

        const newHappiness = tamagotchiReducer(initialStates, stopPlaying(defaultName))
            .tamagotchis[defaultName].happiness;

        expect(newHappiness).toBe(initialHappiness - 15);
    });

    it('can clean poop', () => {
        const initialPoopsCount = 5;
        initialStates.tamagotchis[defaultName].poopsCount = initialPoopsCount;

        const newPoopsCount = tamagotchiReducer(initialStates, cleanPoop(defaultName))
            .tamagotchis[defaultName].poopsCount;

        expect(newPoopsCount).toBe(initialPoopsCount - 1);
    });

    it('canNOT clean poop if there is none', () => {
        const newPoopsCount = tamagotchiReducer(initialStates, cleanPoop(defaultName))
            .tamagotchis[defaultName].poopsCount;

        expect(newPoopsCount).toBe(0);
    });

    it('canNOT let energy go above 100', () => {
        const newEnergy = tamagotchiReducer(initialStates, feed(defaultName, FoodType.Meal))
            .tamagotchis[defaultName].energy;

        expect(newEnergy).toBe(100);
    });

    it('canNOT let happiness go above 100', () => {
        initialStates.tamagotchis[defaultName].happiness = 99;

        const newHappiness = tamagotchiReducer(initialStates, feed(defaultName, FoodType.Meal))
            .tamagotchis[defaultName].happiness;

        expect(newHappiness).toBe(100);
    });

    it('can set a Tamagotchi as Dead from Exhaustion if energy is at 0 on next time step', () => {
        initialStates.tamagotchis[defaultName].energy = 0;

        const tamagotchi = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName];

        expect(tamagotchi.lifeStage).toBe(LifeStage.Dead);
        expect(tamagotchi.causeOfDeath).toBe(CauseOfDeath.Exhaustion);
    });

    it('can set a Tamagotchi as Dead from OverFeeding if hunger is at -100 on next time step', () => {
        initialStates.tamagotchis[defaultName].hunger = -100;

        const tamagotchi = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName];

        expect(tamagotchi.lifeStage).toBe(LifeStage.Dead);
        expect(tamagotchi.causeOfDeath).toBe(CauseOfDeath.OverFeeding);
    });

    it('can set a Tamagotchi as Dead from Starvation if hunger is at 100 on next time step', () => {
        initialStates.tamagotchis[defaultName].hunger = 100;

        const tamagotchi = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName];

        expect(tamagotchi.lifeStage).toBe(LifeStage.Dead);
        expect(tamagotchi.causeOfDeath).toBe(CauseOfDeath.Starvation);
    });

    it('can set a Tamagotchi as Dead from Boredom if happiness is at -100 on next time step', () => {
        initialStates.tamagotchis[defaultName].happiness = -100;

        const tamagotchi = tamagotchiReducer(initialStates, timeStep(defaultName))
            .tamagotchis[defaultName];

        expect(tamagotchi.lifeStage).toBe(LifeStage.Dead);
        expect(tamagotchi.causeOfDeath).toBe(CauseOfDeath.Boredom);
    });

    it('can make a Tamagotchi go from Egg to Baby on the predefined time step', () => {
        assertGrowth(LifeStage.Egg, LifeStage.Baby, defaultName);
    });

    it('can make a Tamagotchi go from Baby to Child on the predefined time step', () => {
        assertGrowth(LifeStage.Baby, LifeStage.Child, defaultName);
    });

    it('can make a Tamagotchi go from Child to Adult on the predefined time step', () => {
        assertGrowth(LifeStage.Child, LifeStage.Adult, defaultName);
    });

    it('can make a Tamagotchi go from Adult to Dead by Natural cause on the predefined time step', () => {
        const tamagotchi = assertGrowth(LifeStage.Adult, LifeStage.Dead, defaultName);
        expect(tamagotchi.causeOfDeath).toBe(CauseOfDeath.Natural);
    });

    function assertGrowth(from: LifeStage, to: LifeStage, name: string): TamagotchiState {
        const fromCycle = cycle(from, name);
        for (let k = 0; k < fromCycle; k++) {
            initialStates = tamagotchiReducer(initialStates, timeStep(name));
        }
        expect(initialStates.tamagotchis[name].lifeStage).toBe(from);

        let states = initialStates;
        for (let k = fromCycle; k < cycle(to, name); k++) {
            states = tamagotchiReducer(states, timeStep(name));
        }
        const tamagotchi = states.tamagotchis[name];

        expect(tamagotchi.lifeStage).toBe(to);

        return tamagotchi;
    }

    function cycle(lifeStage: LifeStage, name: string) {
        const lifeSteps = initialStates.tamagotchis[name].lifeSteps;
        switch (lifeStage) {
            case LifeStage.Egg:
                return 0;
            case LifeStage.Baby:
                return lifeSteps.babyStart;
            case LifeStage.Child:
                return lifeSteps.childStart;
            case LifeStage.Adult:
                return lifeSteps.adultStart;
            case LifeStage.Dead:
                return lifeSteps.naturalDeath;
        }
    }

});
