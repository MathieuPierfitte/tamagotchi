import { Action } from 'redux';

export type Reducer<T> = (state: T, action: Action) => T;
