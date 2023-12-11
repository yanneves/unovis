import { SvelteComponentTyped } from "svelte";
import { LeafletFlowMap, GenericDataRecord } from '@unovis/ts';
declare class __sveltets_Render<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> {
    props(): {
        [x: string]: any;
        data?: {
            points: PointDatum[];
            flows?: FlowDatum[];
        };
        style: string | import("maplibre-gl").StyleSpecification;
        getComponent?: () => LeafletFlowMap<PointDatum, FlowDatum>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type LeafletFlowMapProps<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> = ReturnType<__sveltets_Render<PointDatum, FlowDatum>['props']>;
export declare type LeafletFlowMapEvents<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> = ReturnType<__sveltets_Render<PointDatum, FlowDatum>['events']>;
export declare type LeafletFlowMapSlots<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> = ReturnType<__sveltets_Render<PointDatum, FlowDatum>['slots']>;
export default class LeafletFlowMap<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> extends SvelteComponentTyped<LeafletFlowMapProps<PointDatum, FlowDatum>, LeafletFlowMapEvents<PointDatum, FlowDatum>, LeafletFlowMapSlots<PointDatum, FlowDatum>> {
    get getComponent(): () => LeafletFlowMap<GenericDataRecord, GenericDataRecord>;
}
export {};
