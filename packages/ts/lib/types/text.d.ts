export declare enum TrimMode {
    Start = "start",
    Middle = "middle",
    End = "end"
}
export declare enum VerticalAlign {
    Top = "top",
    Middle = "middle",
    Bottom = "bottom"
}
export declare enum FitMode {
    Wrap = "wrap",
    Trim = "trim",
    Rotate = "rotate"
}
export declare enum TextAlign {
    Left = "left",
    Center = "center",
    Right = "right"
}
export declare type UnovisText = {
    text: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: number;
    color?: string;
    lineHeight?: number;
    marginTop?: number;
    marginBottom?: number;
    fontWidthToHeightRatio?: number;
};
export declare type UnovisWrappedText = UnovisText & {
    _lines: string[];
    _maxWidth: number;
    _estimatedHeight: number;
};
export declare type UnovisTextOptions = {
    x?: number;
    y?: number;
    width?: number;
    separator?: string | string[];
    verticalAlign?: VerticalAlign | string;
    textAlign?: TextAlign | string;
    fitMode?: FitMode | string;
    fastMode?: boolean;
    wordBreak?: boolean;
};
export declare type UnovisTextFrameOptions = UnovisTextOptions & {
    height?: number;
};
