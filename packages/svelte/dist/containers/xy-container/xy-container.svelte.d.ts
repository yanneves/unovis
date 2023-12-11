import { SvelteComponentTyped } from "svelte";
import { XYComponentCore, Tooltip, Crosshair, Axis } from '@unovis/ts';
declare class __sveltets_Render<Datum> {
    props(): {
        /**
           * CSS class string. Requires `:global` modifier to take effect. _i.e._
           * ```css
           * div :global(.chart) { }
           * ```
           * @example
           * <div>
           *     <VisXYContainer class='chart'>
           *        ...
           *     <VisXYContainer>
           * </div>
           *
           * @see {@link https://svelte.dev/docs/svelte-components#styles}
          */ class?: string;
        components?: XYComponentCore<Datum, Partial<import("@unovis/ts").XYComponentConfigInterface<Datum>>>[];
        xScale?: import("@unovis/ts").ContinuousScale;
        xDomain?: [number, number];
        xDomainMinConstraint?: [number, number];
        xDomainMaxConstraint?: [number, number];
        xRange?: [number, number];
        yScale?: import("@unovis/ts").ContinuousScale;
        yDomain?: [number, number];
        yDomainMinConstraint?: [number, number];
        yDomainMaxConstraint?: [number, number];
        yRange?: [number, number];
        yDirection?: string;
        xAxis?: Axis<Datum>;
        yAxis?: Axis<Datum>;
        autoMargin?: boolean;
        tooltip?: Tooltip;
        crosshair?: Crosshair<Datum>;
        preventEmptyDomain?: boolean;
        scaleByDomain?: boolean;
        duration?: number;
        margin?: import("@unovis/ts").Spacing;
        padding?: import("@unovis/ts").Spacing;
        sizing?: string;
        width?: string | number;
        height?: string | number;
        svgDefs?: string;
        ariaLabel?: string;
        data?: Datum[];
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {};
    };
}
export declare type XyContainerProps<Datum> = ReturnType<__sveltets_Render<Datum>['props']>;
export declare type XyContainerEvents<Datum> = ReturnType<__sveltets_Render<Datum>['events']>;
export declare type XyContainerSlots<Datum> = ReturnType<__sveltets_Render<Datum>['slots']>;
export default class XyContainer<Datum> extends SvelteComponentTyped<XyContainerProps<Datum>, XyContainerEvents<Datum>, XyContainerSlots<Datum>> {
}
export {};
