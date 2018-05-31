import { TestBed, inject } from '@angular/core/testing';

import { TamagotchiController } from './tamagotchi.controller';
import { LifeStage } from '../model/life-stage';

class TamagotchiControllerTest extends TamagotchiController {

    stopInterval() {
        clearInterval(this.intervalId);
    }

}

describe('TamagotchiController', () => {
    let tamagotchiController: TamagotchiControllerTest;
    beforeEach(() => tamagotchiController = new TamagotchiControllerTest('Test'));

    it('starts as an Egg', () => {
        expect(tamagotchiController.lifeStage).toBe(LifeStage.Egg);
    });

    it('cannot be put to bed when energy is full', () => {
        expect(tamagotchiController.isSleeping).toBeFalsy();
        expect(tamagotchiController.energy).toBe(100);

        tamagotchiController.putToBed();

        expect(tamagotchiController.isSleeping).toBeFalsy();
    });

    it('loses happiness points when forced to stop playing', () => {
        tamagotchiController.isPlaying = true;
        const happinessBefore = tamagotchiController.happinessMeter;

        tamagotchiController.stopPlaying();

        expect(tamagotchiController.happinessMeter).toBeLessThan(happinessBefore);
    });

    afterEach(() => tamagotchiController.stopInterval());
});
