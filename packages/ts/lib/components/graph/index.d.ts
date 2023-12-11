import { Selection } from 'd3-selection';
import { ComponentCore } from "../../core/component";
import { GraphDataModel } from "../../data-models/graph";
import { GraphInputLink, GraphInputNode } from "../../types/graph";
import { Spacing } from "../../types/spacing";
import { GraphNode, GraphLink } from './types';
import { GraphConfigInterface } from './config';
import * as nodeSelectors from './modules/node/style';
export declare class Graph<N extends GraphInputNode, L extends GraphInputLink> extends ComponentCore<{
    nodes: N[];
    links?: L[];
}, GraphConfigInterface<N, L>> {
    static selectors: {
        root: string;
        background: string;
        node: string;
        nodeShape: string;
        nodeGauge: string;
        nodeSideLabel: string;
        nodeLabel: string;
        link: string;
        linkLine: string;
        panel: string;
        panelRect: string;
        panelSelection: string;
        panelLabel: string;
        panelLabelText: string;
        panelSideIcon: string;
        panelSideIconShape: string;
        panelSideIconSymbol: string;
    };
    static nodeSelectors: typeof nodeSelectors;
    g: Selection<SVGGElement, unknown, null, undefined>;
    protected _defaultConfig: GraphConfigInterface<N, L>;
    config: GraphConfigInterface<N, L>;
    datamodel: GraphDataModel<N, L, GraphNode<N, L>, GraphLink<N, L>>;
    private _selectedNode;
    private _selectedLink;
    private _graphGroup;
    private _panelsGroup;
    private _linksGroup;
    private _nodesGroup;
    private _timer;
    private _isFirstRender;
    private _prevWidth;
    private _prevHeight;
    private _shouldRecalculateLayout;
    private _shouldFitLayout;
    private _shouldSetPanels;
    private _panels;
    private _defs;
    private _backgroundRect;
    private _zoomBehavior;
    private _isAutoFitDisabled;
    private _scale;
    private _initialTransform;
    private _isDragging;
    events: {
        [x: string]: {
            click: () => void;
            mouseover?: undefined;
            mouseout?: undefined;
        } | {
            click: (d: GraphNode<N, L>) => void;
            mouseover: (d: GraphNode<N, L>) => void;
            mouseout: (d: GraphNode<N, L>) => void;
        } | {
            click: (d: GraphLink<N, L>) => void;
            mouseover: (d: GraphLink<N, L>) => void;
            mouseout: (d: GraphLink<N, L>) => void;
        };
    };
    get selectedNode(): GraphNode<N, L>;
    get selectedLink(): GraphLink<N, L>;
    constructor(config?: GraphConfigInterface<N, L>);
    setData(data: {
        nodes: N[];
        links?: L[];
    }): void;
    setConfig(config: GraphConfigInterface<N, L>): void;
    get bleed(): Spacing;
    _render(customDuration?: number): void;
    private _drawNodes;
    private _drawLinks;
    private _drawPanels;
    private _updatePanels;
    private _calculateLayout;
    private _fit;
    private _getTransform;
    private _selectNode;
    private _selectLink;
    private _resetSelection;
    private _updateSelectedElements;
    private _onBackgroundClick;
    private _onNodeClick;
    private _onNodeMouseOut;
    private _onNodeMouseOver;
    private _onLinkClick;
    private _onLinkMouseOver;
    private _onLinkMouseOut;
    private _onLinkFlowTimerFrame;
    private _onZoom;
    private _onDragStarted;
    private _onDragged;
    private _onDragEnded;
    private _shouldLayoutRecalculate;
    private _getMarkerId;
    private _addSVGDefs;
    zoomIn(increment?: number): void;
    zoomOut(increment?: number): void;
    setZoom(zoomLevel: number): void;
    fitView(): void;
    /** Enable automatic fitting to container if it was disabled due to previous zoom / pan interactions */
    resetAutofitState(): void;
    /** Get current coordinates of the nodes as an array of { id: string; x: number; y: number } objects */
    getNodesCoordinates(): {
        id: string;
        x: number;
        y: number;
    }[];
    /** Get node coordinates by id as { id: string; x: number; y: number } */
    getNodeCoordinatesById(id: string): {
        id: string;
        x: number;
        y: number;
    } | undefined;
}
