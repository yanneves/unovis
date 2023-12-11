import { Position } from "../../types/position";
import { GraphInputLink, GraphInputNode, GraphNodeCore, GraphLinkCore } from "../../types/graph";
import { Spacing } from "../../types/spacing";
export declare type GraphNode<N extends GraphInputNode = GraphInputNode, L extends GraphInputLink = GraphInputLink> = GraphNodeCore<N, L> & {
    x?: number;
    y?: number;
    _id?: number | string;
    _index?: number;
    _state?: {
        isDragged?: boolean;
        fx?: number;
        fy?: number;
        selected?: boolean;
        greyout?: boolean;
    };
    _panels?: GraphPanel<N, L>[];
    _isConnected?: boolean;
};
export declare type GraphLink<N extends GraphInputNode = GraphInputNode, L extends GraphInputLink = GraphInputLink> = GraphLinkCore<N, L> & {
    id?: number | string;
    source: number | string | GraphNode<N>;
    target: number | string | GraphNode<N>;
    _id?: number | string;
    _direction?: number;
    _index?: number;
    _neighbours?: number;
    _state?: {
        flowAnimTime?: number;
        hovered?: boolean;
        selected?: boolean;
        greyout?: boolean;
    };
};
export declare enum GraphLayoutType {
    Circular = "circular",
    Concentric = "concentric",
    Parallel = "parallel",
    ParallelHorizontal = "parallel horizontal",
    Dagre = "dagre",
    Force = "force",
    Elk = "elk"
}
export declare type GraphCircleLabel = {
    text: string;
    textColor?: string | null;
    color?: string | null;
    cursor?: string | null;
    fontSize?: string | null;
    radius?: number;
};
export declare enum GraphLinkStyle {
    Dashed = "dashed",
    Solid = "solid"
}
export declare enum GraphLinkArrowStyle {
    Single = "single",
    Double = "double"
}
export declare enum GraphNodeShape {
    Circle = "circle",
    Square = "square",
    Hexagon = "hexagon",
    Triangle = "triangle"
}
export declare type GraphPanelConfig = {
    /** Panel nodes references by unique ids */
    nodes: (string | number)[];
    /** Panel label */
    label?: string;
    /** Position of the label */
    labelPosition?: Position.Top | Position.Bottom | string;
    /** Color of the panel's border */
    borderColor?: string;
    /** Border width of the panel in pixels */
    borderWidth?: number;
    /** Inner padding */
    padding?: number | Spacing;
    /** Dashed outline showing that the panel is selected */
    dashedOutline?: boolean;
    /** Side icon symbol */
    sideIconSymbol?: string;
    /** Size of the icon as a CSS string. e.g.: `12pt` or `12px` */
    sideIconFontSize?: string;
    /** Color of the icon */
    sideIconSymbolColor?: string;
    /** Shape of the icon's background */
    sideIconShape?: GraphNodeShape | string;
    /** Size of the icon's background shape */
    sideIconShapeSize?: number;
    /** Stroke color of the icon's background shape */
    sideIconShapeStroke?: string;
    /** Cursor, when hovering over the icon */
    sideIconCursor?: string;
};
export declare type GraphPanel<N extends GraphInputNode = GraphInputNode, L extends GraphInputLink = GraphInputLink> = GraphPanelConfig & {
    _numNodes?: number;
    _x?: number;
    _y?: number;
    _width?: number;
    _height?: number;
    _disabled?: boolean;
    _padding?: Spacing;
};
export declare type GraphNodeAnimationState = {
    endAngle: number;
    nodeIndex: number;
    nodeSize?: number;
    borderWidth?: number;
};
export declare type GraphNodeAnimatedElement<T = SVGElement> = T & {
    _animState: GraphNodeAnimationState;
};
export declare type GraphForceLayoutSettings = {
    /** Preferred Link Distance. Default: `60` */
    linkDistance?: number;
    /** Link Strength [0:1]. Default: `0.45` */
    linkStrength?: number;
    /** Charge Force (<0 repulsion, >0 attraction). Default: `-500` */
    charge?: number;
    /** X-centring force. Default: `0.15` */
    forceXStrength?: number;
    /** Y-centring force. Default: `0.25` */
    forceYStrength?: number;
};
export declare type GraphElkLayoutSettings = Record<string, string>;
