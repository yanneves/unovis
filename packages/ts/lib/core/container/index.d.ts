import { Selection } from 'd3-selection';
import { ContainerConfigInterface } from './config';
export declare class ContainerCore {
    svg: Selection<SVGSVGElement, unknown, null, undefined>;
    element: SVGSVGElement;
    prevConfig: ContainerConfigInterface;
    config: ContainerConfigInterface;
    protected _defaultConfig: ContainerConfigInterface;
    protected _container: HTMLElement;
    protected _requestedAnimationFrame: number;
    protected _isFirstRender: boolean;
    protected _resizeObserver: ResizeObserver | undefined;
    protected _svgDefs: Selection<SVGDefsElement, unknown, null, undefined>;
    private _containerSize;
    static DEFAULT_CONTAINER_HEIGHT: number;
    constructor(element: HTMLElement);
    updateContainer<T extends ContainerConfigInterface>(config: T): void;
    protected _preRender(): void;
    protected _render(duration?: number): void;
    render(duration?: number): void;
    get containerWidth(): number;
    get containerHeight(): number;
    get width(): number;
    get height(): number;
    protected _removeAllChildren(): void;
    protected _onResize(): void;
    protected _setUpResizeObserver(): void;
    destroy(): void;
}
