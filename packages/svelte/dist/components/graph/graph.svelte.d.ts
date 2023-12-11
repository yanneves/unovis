import { SvelteComponentTyped } from "svelte";
import { Graph, GraphInputNode, GraphInputLink } from '@unovis/ts';
declare class __sveltets_Render<N extends GraphInputNode, L extends GraphInputLink> {
    props(): {
        [x: string]: any;
        data?: {
            nodes: N[];
            links?: L[];
        };
        getComponent?: () => Graph<N, L>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type GraphProps<N extends GraphInputNode, L extends GraphInputLink> = ReturnType<__sveltets_Render<N, L>['props']>;
export declare type GraphEvents<N extends GraphInputNode, L extends GraphInputLink> = ReturnType<__sveltets_Render<N, L>['events']>;
export declare type GraphSlots<N extends GraphInputNode, L extends GraphInputLink> = ReturnType<__sveltets_Render<N, L>['slots']>;
export default class Graph<N extends GraphInputNode, L extends GraphInputLink> extends SvelteComponentTyped<GraphProps<N, L>, GraphEvents<N, L>, GraphSlots<N, L>> {
    get getComponent(): () => Graph<GraphInputNode, GraphInputLink>;
}
export {};
