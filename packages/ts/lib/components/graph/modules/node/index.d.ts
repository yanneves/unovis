import { Selection } from 'd3-selection';
import { Transition } from 'd3-transition';
import { GraphInputLink, GraphInputNode } from "../../../../types/graph";
import { GraphNode } from '../../types';
import { GraphConfigInterface } from '../../config';
export interface GraphNodeSVGGElement extends SVGGElement {
    nodeShape?: string;
}
export declare function createNodes<N extends GraphInputNode, L extends GraphInputLink>(selection: Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>, config: GraphConfigInterface<N, L>): void;
export declare function updateSelectedNodes<N extends GraphInputNode, L extends GraphInputLink>(selection: Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>, config: GraphConfigInterface<N, L>): void;
export declare function updateNodes<N extends GraphInputNode, L extends GraphInputLink>(selection: Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>, config: GraphConfigInterface<N, L>, duration: number, scale?: number): Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown> | Transition<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>;
export declare function removeNodes<N extends GraphInputNode, L extends GraphInputLink>(selection: Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>, config: GraphConfigInterface<N, L>, duration: number): void;
export declare function zoomNodes<N extends GraphInputNode, L extends GraphInputLink>(selection: Selection<SVGGElement, GraphNode<N, L>, SVGGElement, unknown>, config: GraphConfigInterface<N, L>, scale: number): void;
export declare const zoomNodesThrottled: import("throttle-debounce").throttle<typeof zoomNodes>;
