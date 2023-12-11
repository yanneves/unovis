import { SvelteComponentTyped } from "svelte";
import { FreeBrush } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        getComponent?: () => FreeBrush<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type FreeBrushProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type FreeBrushEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type FreeBrushSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class FreeBrush<Datum> extends SvelteComponentTyped<FreeBrushProps<Datum>, FreeBrushEvents<Datum>, FreeBrushSlots<Datum>> {
    get getComponent(): () => FreeBrush<unknown>;
}
export {};
