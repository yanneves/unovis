import { SymbolType } from "../../types/symbol";
export declare type ScatterPoint<D> = D & {
    _point: {
        xValue: number;
        yValue: number;
        sizePx: number;
        color: string | null;
        strokeColor: string | null;
        strokeWidthPx: number | null;
        shape: SymbolType | string;
        label: string | null;
        labelColor: string | null;
        cursor: string | null;
        groupIndex: number;
        pointIndex: number;
    };
};
export declare type ScatterPointGroupNode = SVGGElement & {
    _labelVisible: boolean;
    _forceShowLabel?: boolean;
};
