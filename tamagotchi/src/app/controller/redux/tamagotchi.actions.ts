import { TamagotchiState } from './tamagotchi.state';
import { AnyAction } from 'redux';
import { FoodType } from '../../model/food-type';

export const NEW_TAMAGOTCHI = 'NEW_TAMAGOTCHI';
export function newTamagotchi(name: string, initialState: TamagotchiState): AnyAction {
    return { type: NEW_TAMAGOTCHI, name: name, state: initialState };
}

export const TIME_STEP = 'TIME_STEP';
export function timeStep(tamagotchi: string): AnyAction {
    return { type: TIME_STEP, tamagotchi: tamagotchi };
}

export const FEED = 'FEED';
export function feed(tamagotchi: string, foodType: FoodType): AnyAction {
    return { type: FEED, tamagotchi: tamagotchi, foodType: foodType };
}

export const PUT_TO_BED = 'PUT_TO_BED';
export function putToBed(tamagotchi: string): AnyAction {
    return { type: PUT_TO_BED, tamagotchi: tamagotchi };
}
export const WAKE_UP = 'WAKE_UP';
export function wakeUp(tamagotchi: string): AnyAction {
    return { type: WAKE_UP, tamagotchi: tamagotchi };
}

export const START_PLAYING = 'START_PLAYING';
export function startPlaying(tamagotchi: string): AnyAction {
    return { type: START_PLAYING, tamagotchi: tamagotchi };
}
export const STOP_PLAYING = 'STOP_PLAYING';
export function stopPlaying(tamagotchi: string): AnyAction {
    return { type: STOP_PLAYING, tamagotchi: tamagotchi };
}

export const CLEAN_POOP = 'CLEAN_POOP';
export function cleanPoop(tamagotchi: string): AnyAction {
    return { type: CLEAN_POOP, tamagotchi: tamagotchi };
}
