import { CYCLES_PER_SEC } from '../configuration';

export class Random {

    static between(minS: number, maxS: number): number {
        return ( minS + Math.random() * (maxS - minS) ) * CYCLES_PER_SEC;
    }

    static standard(coefficient: number = 1): number {
        return (Math.random() / CYCLES_PER_SEC) * coefficient;
    }

}
