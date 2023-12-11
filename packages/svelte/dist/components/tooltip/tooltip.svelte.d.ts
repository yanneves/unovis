import { SvelteComponentTyped } from "svelte";
import { Tooltip } from '@unovis/ts';
declare const __propDef: {
    props: {
        [x: string]: any;
        getComponent?: () => Tooltip;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type TooltipProps = typeof __propDef.props;
export declare type TooltipEvents = typeof __propDef.events;
export declare type TooltipSlots = typeof __propDef.slots;
export default class Tooltip extends SvelteComponentTyped<TooltipProps, TooltipEvents, TooltipSlots> {
    get getComponent(): () => Tooltip;
}
export {};
