import { SvelteComponentTyped } from "svelte";
import { TopoJSONMap } from '@unovis/ts';
declare class __sveltets_Render<AreaDatum, PointDatum, LinkDatum> {
    props(): {
        [x: string]: any;
        data?: {
            areas?: AreaDatum[];
            points?: PointDatum[];
            links?: LinkDatum[];
        };
        getComponent?: () => TopoJSONMap<AreaDatum, PointDatum, LinkDatum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type TopojsonMapProps<AreaDatum, PointDatum, LinkDatum> = ReturnType<__sveltets_Render<AreaDatum, PointDatum, LinkDatum>['props']>;
export declare type TopojsonMapEvents<AreaDatum, PointDatum, LinkDatum> = ReturnType<__sveltets_Render<AreaDatum, PointDatum, LinkDatum>['events']>;
export declare type TopojsonMapSlots<AreaDatum, PointDatum, LinkDatum> = ReturnType<__sveltets_Render<AreaDatum, PointDatum, LinkDatum>['slots']>;
export default class TopojsonMap<AreaDatum, PointDatum, LinkDatum> extends SvelteComponentTyped<TopojsonMapProps<AreaDatum, PointDatum, LinkDatum>, TopojsonMapEvents<AreaDatum, PointDatum, LinkDatum>, TopojsonMapSlots<AreaDatum, PointDatum, LinkDatum>> {
    get getComponent(): () => TopoJSONMap<unknown, unknown, unknown>;
}
export {};
