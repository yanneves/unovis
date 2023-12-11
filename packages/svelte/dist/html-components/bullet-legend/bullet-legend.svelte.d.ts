import { SvelteComponentTyped } from "svelte";
import { BulletLegend, BulletLegendItemInterface } from '@unovis/ts';
declare const __propDef: {
    props: {
        [x: string]: any;
        items: BulletLegendItemInterface[];
        getComponent?: () => BulletLegend;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type BulletLegendProps = typeof __propDef.props;
export declare type BulletLegendEvents = typeof __propDef.events;
export declare type BulletLegendSlots = typeof __propDef.slots;
export default class BulletLegend extends SvelteComponentTyped<BulletLegendProps, BulletLegendEvents, BulletLegendSlots> {
    get getComponent(): () => BulletLegend;
}
export {};
