import { SvelteComponentTyped } from "svelte";
import { XYLabels, NumericAccessor } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        x: NumericAccessor<Datum>;
        y: NumericAccessor<Datum>;
        getComponent?: () => XYLabels<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type XyLabelsProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type XyLabelsEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type XyLabelsSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class XyLabels<Datum> extends SvelteComponentTyped<XyLabelsProps<Datum>, XyLabelsEvents<Datum>, XyLabelsSlots<Datum>> {
    get getComponent(): () => XYLabels<unknown>;
}
export {};
