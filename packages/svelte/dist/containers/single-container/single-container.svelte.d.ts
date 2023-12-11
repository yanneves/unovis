import { SvelteComponentTyped } from "svelte";
import { ComponentCore, Tooltip } from '@unovis/ts';
declare class __sveltets_Render<Data> {
    props(): {
        /**
           * CSS class string. Requires `:global` modifier to take effect. _i.e._
           * ```css
           * div :global(.chart) { }
           * ```
           * @example
           * <div>
           *     <VisSingleContainer class='chart'>
           *        ...
           *     </VisSingleContainer>
           * </div>
           *
           * @see {@link https://svelte.dev/docs/svelte-components#styles}
          */ class?: string;
        component?: ComponentCore<Data, import("@unovis/ts").ComponentConfigInterface>;
        tooltip?: Tooltip;
        duration?: number;
        margin?: import("@unovis/ts").Spacing;
        padding?: import("@unovis/ts").Spacing;
        sizing?: string;
        width?: string | number;
        height?: string | number;
        svgDefs?: string;
        ariaLabel?: string;
        data?: Data;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {};
    };
}
export declare type SingleContainerProps<Data> = ReturnType<__sveltets_Render<Data>['props']>;
export declare type SingleContainerEvents<Data> = ReturnType<__sveltets_Render<Data>['events']>;
export declare type SingleContainerSlots<Data> = ReturnType<__sveltets_Render<Data>['slots']>;
export default class SingleContainer<Data> extends SvelteComponentTyped<SingleContainerProps<Data>, SingleContainerEvents<Data>, SingleContainerSlots<Data>> {
}
export {};
