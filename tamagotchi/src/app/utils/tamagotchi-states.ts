import { TamagotchisStates } from '../controller/redux/tamagotchi.state';
import { LifeStage, CauseOfDeath } from '../model/life-stage';
import { LifeStages } from './life-stages';
import { Random } from './random';
import { FoodType } from '../model/food-type';
import { TIRED_ENERGY_MARK } from '../configuration';
import { deepMerge } from './deep';

export class TamagotchiStates {

    static timeStep(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        if (t.energy <= 0) {
            return reduce(state, name, {
                lifeStage: LifeStage.Dead,
                causeOfDeath: CauseOfDeath.Exhaustion
            });
        } else if (t.hunger <= -100) {
            return reduce(state, name, {
                lifeStage: LifeStage.Dead,
                causeOfDeath: CauseOfDeath.OverFeeding
            });
        } else if (t.hunger >= 100) {
            return reduce(state, name, {
                lifeStage: LifeStage.Dead,
                causeOfDeath: CauseOfDeath.Starvation
            });
        } else if (t.happiness <= -100) {
            return reduce(state, name, {
                lifeStage: LifeStage.Dead,
                causeOfDeath: CauseOfDeath.Boredom
            });
        } else {
            return TamagotchiStates.aliveTimeStep(state, name);
        }
    }

    private static aliveTimeStep(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        const newState = reduce(state, name, { cycle: t.cycle + 1 });
        const newT = newState.tamagotchis[name];
        newT.lifeStage = LifeStages.get(newT.cycle, newT.lifeSteps);
        if (newT.lifeStage === LifeStage.Dead) {
            newT.causeOfDeath = CauseOfDeath.Natural;
        }
        if (newT.lifeStage === LifeStage.Egg || newT.lifeStage === LifeStage.Dead) {
            return newState;
        } else {
            if (newT.isSleeping) {
                newT.energy += Random.standard(5);
                newT.isSleeping = !TamagotchiStates.spontaneousWakeUp(newT.energy);
            } else if (newT.isPlaying) {
                newT.energy -= Random.standard(newT.lifeStage === LifeStage.Child ? 6 : 3);
                newT.happiness += Random.standard(5);
                newT.isPlaying = TamagotchiStates.keepPlaying();
            } else {
                newT.energy -= Random.standard(newT.lifeStage === LifeStage.Child ? 4 : 2);
                newT.happiness -= Random.standard();
                newT.isSleeping = TamagotchiStates.fallAsleep(newT.energy);
                if (Random.boolean(-newT.hunger / 5)) {
                    newT.poopsCount++;
                }
            }
            newT.hunger += Random.standard(newT.isPlaying ? 2 : 1);
            newT.happiness -= newT.poopsCount / 2;
            newT.energy -= Math.max(newT.hunger / 50, 0);
            return normalize(newState, name);
        }
    }

    private static spontaneousWakeUp(energy: number): boolean {
        return Random.boolean((energy - 80) * 2);
    }

    private static fallAsleep(energy: number): boolean {
        return Random.boolean((30 - energy) * 2);
    }

    private static keepPlaying(): boolean {
        return Random.boolean(90);
    }

    static feed(state: TamagotchisStates, name: string, foodType: FoodType): TamagotchisStates {
        const t = state.tamagotchis[name];
        if (foodType === FoodType.Meal) {
            return reduce(state, name, {
                energy: t.energy + 10,
                hunger: t.hunger - 30,
                happiness: t.happiness + 10
            });
        } else {
            return reduce(state, name, {
                energy: t.energy + 5,
                hunger: t.hunger - 5,
                happiness: t.happiness + 20
            });
        }
    }

    static putToBed(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        if (t.energy < TIRED_ENERGY_MARK) {
            return reduce(state, name, { isSleeping: true });
        } else {
            return reduce(state, name, { happiness: t.happiness - 10 });
        }
    }

    static wakeUp(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        const newState = reduce(state, name, { isSleeping: false });
        const newT = newState.tamagotchis[name];
        if (t.energy < 75) {
            newT.happiness -= 30;
        }
        return newState;
    }

    static startPlaying(state: TamagotchisStates, name: string): TamagotchisStates {
        return reduce(state, name, { isPlaying: true });
    }

    static stopPlaying(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        return reduce(state, name, {
            isPlaying: false,
            happiness: t.happiness - 15
        });
    }

    static cleanPoop(state: TamagotchisStates, name: string): TamagotchisStates {
        const t = state.tamagotchis[name];
        return reduce(state, name, { poopsCount: Math.max(t.poopsCount - 1, 0) });
    }

    private constructor() { }

}

function reduce(state: TamagotchisStates, name: string, updates: any) {
    return normalize(deepMerge({}, state, {
        tamagotchis: { [name]: updates }
    }), name);
}

function normalize(state: TamagotchisStates, name): TamagotchisStates {
    const t = state.tamagotchis[name];
    t.energy = Math.min(t.energy, 100);
    t.hunger = Math.min(Math.max(t.hunger, -100), 100);
    t.happiness = Math.min(t.happiness, 100);
    return state;
}
