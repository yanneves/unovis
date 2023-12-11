import { SvelteComponentTyped } from "svelte";
import { Axis } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        getComponent?: () => Axis<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type AxisProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type AxisEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type AxisSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class Axis<Datum> extends SvelteComponentTyped<AxisProps<Datum>, AxisEvents<Datum>, AxisSlots<Datum>> {
    get getComponent(): () => Axis<unknown>;
}
export {};
