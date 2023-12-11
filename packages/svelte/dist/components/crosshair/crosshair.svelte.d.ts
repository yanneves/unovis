import { SvelteComponentTyped } from "svelte";
import { Crosshair } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        getComponent?: () => Crosshair<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type CrosshairProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type CrosshairEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type CrosshairSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class Crosshair<Datum> extends SvelteComponentTyped<CrosshairProps<Datum>, CrosshairEvents<Datum>, CrosshairSlots<Datum>> {
    get getComponent(): () => Crosshair<unknown>;
}
export {};
