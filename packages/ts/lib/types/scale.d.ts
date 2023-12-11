import { scaleLinear, scalePow, scaleSqrt, scaleLog, scaleIdentity, scaleTime, scaleUtc, scaleSequential, scaleDiverging, scaleQuantize, scaleQuantile, scaleThreshold, scaleOrdinal, scaleBand, scalePoint, ScaleLinear, ScalePower, ScaleLogarithmic, ScaleTime } from 'd3-scale';
export declare type ContinuousScale = ScaleLinear<number, number> | ScalePower<number, number> | ScaleLogarithmic<number, number> | ScaleTime<number, number>;
export declare const Scale: {
    scaleLinear: typeof scaleLinear;
    scalePow: typeof scalePow;
    scaleSqrt: typeof scaleSqrt;
    scaleLog: typeof scaleLog;
    scaleIdentity: typeof scaleIdentity;
    scaleTime: typeof scaleTime;
    scaleUtc: typeof scaleUtc;
    scaleSequential: typeof scaleSequential;
    scaleDiverging: typeof scaleDiverging;
    scaleQuantize: typeof scaleQuantize;
    scaleQuantile: typeof scaleQuantile;
    scaleThreshold: typeof scaleThreshold;
    scaleOrdinal: typeof scaleOrdinal;
    scaleBand: typeof scaleBand;
    scalePoint: typeof scalePoint;
};
export declare enum ScaleDimension {
    X = "x",
    Y = "y"
}
