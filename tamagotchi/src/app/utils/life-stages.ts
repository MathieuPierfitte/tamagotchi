import { TamagotchiState, LifeSteps } from '../controller/redux/tamagotchi.state';
import { LifeStage } from '../model/life-stage';

export class LifeStages {

    static get(cycle: number, lifeSteps: LifeSteps): LifeStage {
        switch (true) {
            case cycle >= lifeSteps.naturalDeath:
                return LifeStage.Dead;
            case cycle >= lifeSteps.adultStart:
                return LifeStage.Adult;
            case cycle >= lifeSteps.childStart:
                return LifeStage.Child;
            case cycle >= lifeSteps.babyStart:
                return LifeStage.Baby;
            default:
                return LifeStage.Egg;
        }
    }

    private constructor() { }

}
