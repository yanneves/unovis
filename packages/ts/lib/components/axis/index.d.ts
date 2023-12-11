import { Selection } from 'd3-selection';
import { Axis as D3Axis } from 'd3-axis';
import { XYComponentCore } from "../../core/xy-component";
import { Position } from "../../types/position";
import { Spacing } from "../../types/spacing";
import { TextAlign } from "../../types/text";
import { AxisConfigInterface } from './config';
import * as s from './style';
export declare class Axis<Datum> extends XYComponentCore<Datum, AxisConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: AxisConfigInterface<Datum>;
    config: AxisConfigInterface<Datum>;
    axisGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    gridGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    private _axisRawBBox;
    private _axisSizeBBox;
    private _requiredMargin;
    private _defaultNumTicks;
    private _minMaxTicksOnlyEnforceWidth;
    events: {};
    constructor(config?: AxisConfigInterface<Datum>);
    /** Renders axis to an invisible grouped to calculate automatic chart margins */
    preRender(): void;
    getPosition(): Position;
    _getAxisSize(selection: Selection<SVGGElement, unknown, SVGGElement, undefined>): SVGRect;
    _getRequiredMargin(axisSize?: DOMRect): Spacing;
    getRequiredMargin(): Spacing;
    /** Calculates axis transform:translate offset based on passed container margins */
    getOffset(containerMargin: Spacing): {
        left: number;
        top: number;
    };
    _render(duration?: number, selection?: Selection<SVGGElement, unknown, SVGGElement, unknown>): void;
    _buildAxis(): D3Axis<any>;
    _buildGrid(): D3Axis<any>;
    _renderAxis(selection?: Selection<SVGGElement, unknown, SVGGElement, unknown>, duration?: number): void;
    _getNumTicks(): number;
    _getConfiguredTickValues(): number[] | null;
    _getFullDomainPath(tickSize?: number): string;
    _renderAxisLabel(selection?: Selection<SVGGElement, unknown, SVGGElement, unknown>): void;
    _getLabelDY(): number;
    _alignTickLabels(): void;
    _getTickTextAnchor(textAlign: TextAlign): string;
    _getYTickTextTranslate(textAlign: TextAlign, axisPosition?: Position): number;
}
