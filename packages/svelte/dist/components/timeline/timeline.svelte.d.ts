import { SvelteComponentTyped } from "svelte";
import { Timeline, NumericAccessor } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        x: NumericAccessor<Datum>;
        getComponent?: () => Timeline<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type TimelineProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type TimelineEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type TimelineSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class Timeline<Datum> extends SvelteComponentTyped<TimelineProps<Datum>, TimelineEvents<Datum>, TimelineSlots<Datum>> {
    get getComponent(): () => Timeline<unknown>;
}
export {};
