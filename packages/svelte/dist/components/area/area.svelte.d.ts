import { SvelteComponentTyped } from "svelte";
import { Area, NumericAccessor } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        x: NumericAccessor<Datum>;
        y: NumericAccessor<Datum> | NumericAccessor<Datum>[];
        getComponent?: () => Area<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type AreaProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type AreaEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type AreaSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class Area<Datum> extends SvelteComponentTyped<AreaProps<Datum>, AreaEvents<Datum>, AreaSlots<Datum>> {
    get getComponent(): () => Area<unknown>;
}
export {};
