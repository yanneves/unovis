import { HierarchyRectangularNode } from 'd3-hierarchy';
export declare type NestedDonutSegmentDatum<Datum> = {
    key: string;
    root: string;
    values: Datum[];
};
export declare type NestedDonutSegment<Datum> = HierarchyRectangularNode<NestedDonutSegmentDatum<Datum>> & {
    _id: string;
    _layer: NestedDonutLayer;
    _index?: number;
    _state?: {
        fill?: string;
        fillOpacity?: number | null;
    };
};
export declare enum NestedDonutDirection {
    Inwards = "inwards",
    Outwards = "outwards"
}
export declare enum NestedDonutSegmentLabelAlignment {
    Along = "along",
    Perpendicular = "perpendicular",
    Straight = "straight"
}
export declare type NestedDonutLayerSettings = {
    backgroundColor?: string;
    labelAlignment?: NestedDonutSegmentLabelAlignment;
    width?: number | string;
};
export declare type NestedDonutLayer = NestedDonutLayerSettings & {
    _id: number;
    _innerRadius: number;
    _outerRadius: number;
};
