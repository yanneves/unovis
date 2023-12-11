import { Selection } from 'd3-selection';
import { BulletLegendConfigInterface } from './config';
import { BulletLegendItemInterface } from './types';
import * as s from './style';
export declare class BulletLegend {
    static selectors: typeof s;
    protected _defaultConfig: BulletLegendConfigInterface;
    config: BulletLegendConfigInterface;
    div: Selection<HTMLDivElement, unknown, null, undefined>;
    element: HTMLElement;
    prevConfig: BulletLegendConfigInterface;
    protected _container: HTMLElement;
    private _colorAccessor;
    constructor(element: HTMLElement, config?: BulletLegendConfigInterface);
    update(config: BulletLegendConfigInterface): void;
    render(): void;
    _isItemClickable(item: BulletLegendItemInterface): boolean;
    _onItemClick(event: MouseEvent, d: BulletLegendItemInterface): void;
    destroy(): void;
}
