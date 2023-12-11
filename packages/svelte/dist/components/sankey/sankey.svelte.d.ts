import { SvelteComponentTyped } from "svelte";
import { Sankey, SankeyInputNode, SankeyInputLink } from '@unovis/ts';
declare class __sveltets_Render<N extends SankeyInputNode, L extends SankeyInputLink> {
    props(): {
        [x: string]: any;
        data?: {
            nodes: N[];
            links?: L[];
        };
        getComponent?: () => Sankey<N, L>;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type SankeyProps<N extends SankeyInputNode, L extends SankeyInputLink> = ReturnType<__sveltets_Render<N, L>['props']>;
export declare type SankeyEvents<N extends SankeyInputNode, L extends SankeyInputLink> = ReturnType<__sveltets_Render<N, L>['events']>;
export declare type SankeySlots<N extends SankeyInputNode, L extends SankeyInputLink> = ReturnType<__sveltets_Render<N, L>['slots']>;
export default class Sankey<N extends SankeyInputNode, L extends SankeyInputLink> extends SvelteComponentTyped<SankeyProps<N, L>, SankeyEvents<N, L>, SankeySlots<N, L>> {
    get getComponent(): () => Sankey<import("@unovis/ts").GraphInputNode, import("@unovis/ts").GraphInputLink>;
}
export {};
