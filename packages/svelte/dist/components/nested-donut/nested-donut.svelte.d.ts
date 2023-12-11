import { SvelteComponentTyped } from "svelte";
import { NestedDonut, StringAccessor } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        layers: StringAccessor<Datum>[];
        getComponent?: () => NestedDonut<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type NestedDonutProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type NestedDonutEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type NestedDonutSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class NestedDonut<Datum> extends SvelteComponentTyped<NestedDonutProps<Datum>, NestedDonutEvents<Datum>, NestedDonutSlots<Datum>> {
    get getComponent(): () => NestedDonut<unknown>;
}
export {};
