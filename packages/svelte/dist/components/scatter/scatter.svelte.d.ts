import { SvelteComponentTyped } from "svelte";
import { Scatter, NumericAccessor } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        x: NumericAccessor<Datum>;
        y: NumericAccessor<Datum> | NumericAccessor<Datum>[];
        getComponent?: () => Scatter<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type ScatterProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type ScatterEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type ScatterSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class Scatter<Datum> extends SvelteComponentTyped<ScatterProps<Datum>, ScatterEvents<Datum>, ScatterSlots<Datum>> {
    get getComponent(): () => Scatter<unknown>;
}
export {};
