import { TestBed, inject } from '@angular/core/testing';

import { TamagotchiController } from './tamagotchi.controller';
import { LifeStage } from '../model/life-stage';
import { TamagotchisStates } from './redux/tamagotchi.state';

class TamagotchiControllerTest extends TamagotchiController {

    stopInterval() {
        clearInterval(this.intervalId);
    }

    dispatchNew() { }

}

describe('TamagotchiController', () => {
    let tamagotchiController: TamagotchiControllerTest;
    beforeEach(() => tamagotchiController = new TamagotchiControllerTest('Test', null));

    it('starts at Egg life stage', () => {
        expect(tamagotchiController.state.lifeStage).toBe(LifeStage.Egg);
    });

    afterEach(() => tamagotchiController.stopInterval());
});
