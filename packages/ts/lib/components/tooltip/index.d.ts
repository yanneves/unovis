import { Selection } from 'd3-selection';
import { ComponentCore } from "../../core/component";
import { TooltipConfigInterface } from './config';
import * as s from './style';
export declare class Tooltip {
    element: HTMLElement;
    div: Selection<HTMLElement, unknown, null, undefined>;
    protected _defaultConfig: TooltipConfigInterface;
    config: TooltipConfigInterface;
    prevConfig: TooltipConfigInterface;
    components: ComponentCore<unknown>[];
    static selectors: typeof s;
    private _setUpEventsThrottled;
    private _setContainerPositionThrottled;
    private _isShown;
    private _container;
    constructor(config?: TooltipConfigInterface);
    setConfig(config: TooltipConfigInterface): void;
    setContainer(container: HTMLElement): void;
    getContainer(): HTMLElement;
    hasContainer(): boolean;
    setComponents(components: ComponentCore<unknown>[]): void;
    update(): void;
    show(html: string | HTMLElement, pos: {
        x: number;
        y: number;
    }): void;
    hide(): void;
    place(pos: {
        x: number;
        y: number;
    }): void;
    isContainerBody(): boolean;
    private _setContainerPosition;
    private _setUpEvents;
    private _setUpAttributes;
    destroy(): void;
}
