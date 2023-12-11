import { SvelteComponentTyped } from "svelte";
import { LeafletMap, GenericDataRecord } from '@unovis/ts';
declare class __sveltets_Render<Datum extends GenericDataRecord> {
    props(): {
        [x: string]: any;
        data?: Datum[];
        style: string | import("maplibre-gl").StyleSpecification;
        getComponent?: () => LeafletMap<Datum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type LeafletMapProps<Datum extends GenericDataRecord> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type LeafletMapEvents<Datum extends GenericDataRecord> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type LeafletMapSlots<Datum extends GenericDataRecord> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class LeafletMap<Datum extends GenericDataRecord> extends SvelteComponentTyped<LeafletMapProps<Datum>, LeafletMapEvents<Datum>, LeafletMapSlots<Datum>> {
    get getComponent(): () => LeafletMap<GenericDataRecord>;
}
export {};
