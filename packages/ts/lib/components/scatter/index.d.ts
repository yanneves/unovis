import { XYComponentCore } from "../../core/xy-component";
import { Spacing } from "../../types/spacing";
import { ScatterPoint } from './types';
import { ScatterConfigInterface } from './config';
import * as s from './style';
export declare class Scatter<Datum> extends XYComponentCore<Datum, ScatterConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: ScatterConfigInterface<Datum>;
    config: ScatterConfigInterface<Datum>;
    events: {
        [x: string]: {
            mouseenter: (d: ScatterPoint<Datum>, event: MouseEvent) => void;
            mouseleave: (d: ScatterPoint<Datum>, event: MouseEvent) => void;
        };
    };
    private _pointData;
    private _points;
    private _collideLabelsAnimFrameId;
    constructor(config?: ScatterConfigInterface<Datum>);
    setConfig(config: ScatterConfigInterface<Datum>): void;
    setData(data: Datum[]): void;
    get bleed(): Spacing;
    _render(customDuration?: number): void;
    private _resolveLabelOverlap;
    private _updateSizeScale;
    private _getOnScreenData;
    private _onPointMouseOver;
    private _onPointMouseOut;
}
