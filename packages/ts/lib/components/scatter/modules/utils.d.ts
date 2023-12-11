import { Selection } from 'd3-selection';
import { Position } from "../../../types/position";
import { ContinuousScale } from "../../../types/scale";
import { Rect } from "../../../types/misc";
import { ScatterPoint } from '../types';
import { ScatterConfigInterface } from '../config';
export declare function isLabelPositionCenter(labelPosition: Position | `${Position}`): boolean;
export declare function getCentralLabelFontSize(pointDiameter: number, textLength: number): number;
export declare function getLabelShift(labelPosition: `${Position}`, pointDiameter: number, labelPadding?: number): [number, number];
export declare function getEstimatedLabelBBox<Datum>(d: ScatterPoint<Datum>, labelPosition: Position | `${Position}`, xScale: ContinuousScale, yScale: ContinuousScale, fontSizePx: number): Rect;
export declare function collideLabels<Datum>(selection: Selection<SVGGElement, ScatterPoint<Datum>, SVGGElement, ScatterPoint<Datum>[]>, config: ScatterConfigInterface<Datum>, xScale: ContinuousScale, yScale: ContinuousScale): void;
