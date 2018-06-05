import { Reducer } from './reducer';
import { AnyAction } from 'redux';
import { TamagotchisStates, InitialTamagotchiState } from './tamagotchi.state';
import { NEW_TAMAGOTCHI, TIME_STEP, FEED, PUT_TO_BED, WAKE_UP, START_PLAYING, STOP_PLAYING, CLEAN_POOP } from './tamagotchi.actions';
import { TamagotchiStates } from '../../utils/tamagotchi-states';
import { deepMerge } from '../../utils/deep';

export const tamagotchiReducer: Reducer<TamagotchisStates> = (state: TamagotchisStates, action: AnyAction) => {

    switch (action.type) {
        case NEW_TAMAGOTCHI:
            return deepMerge({}, state, { tamagotchis: { [action.name]: action.state } });
        case TIME_STEP:
            return TamagotchiStates.timeStep(state, action.tamagotchi);
        case FEED:
            return TamagotchiStates.feed(state, action.tamagotchi, action.foodType);
        case PUT_TO_BED:
            return TamagotchiStates.putToBed(state, action.tamagotchi);
        case WAKE_UP:
            return TamagotchiStates.wakeUp(state, action.tamagotchi);
        case START_PLAYING:
            return TamagotchiStates.startPlaying(state, action.tamagotchi);
        case STOP_PLAYING:
            return TamagotchiStates.stopPlaying(state, action.tamagotchi);
        case CLEAN_POOP:
            return TamagotchiStates.cleanPoop(state, action.tamagotchi);
        default:
            return state;

    }

};
