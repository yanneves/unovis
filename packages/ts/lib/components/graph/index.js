import { __awaiter } from 'tslib';
import { min, max } from 'd3-array';
import { select, pointer } from 'd3-selection';
import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
import { drag } from 'd3-drag';
import { interval } from 'd3-timer';
import { ComponentCore } from '../../core/component/index.js';
import { GraphDataModel } from '../../data-models/graph.js';
import { isNumber, clamp, getBoolean, isFunction, shallowDiff, unique, clean } from '../../utils/data.js';
import { stringToHtmlId } from '../../utils/misc.js';
import { smartTransition } from '../../utils/d3.js';
import { GraphLayoutType, GraphLinkArrowStyle } from './types.js';
import { GraphDefaultConfig } from './config.js';
import { background, graphGroup, root } from './style.js';
import * as style from './modules/node/style.js';
import { nodes, gNode, gNodeExit, node, nodeGauge, sideLabelGroup, label } from './modules/node/style.js';
import { links, gLink, gLinkExit, link } from './modules/link/style.js';
import { panels, gPanel, panel, panelSelection, label as label$1, labelText, sideIconGroup, sideIconShape, sideIconSymbol } from './modules/panel/style.js';
import { createNodes, updateNodes, removeNodes, updateSelectedNodes, zoomNodesThrottled, zoomNodes } from './modules/node/index.js';
import { getMaxNodeSize, getX, getY, getNodeSize } from './modules/node/helper.js';
import { createLinks, updateLinks, removeLinks, updateSelectedLinks, animateLinkFlow, zoomLinksThrottled, zoomLinks } from './modules/link/index.js';
import { getLinkColor, getLinkArrow, LINK_MARKER_WIDTH, LINK_MARKER_HEIGHT, getDoubleArrowPath, getArrowPath } from './modules/link/helper.js';
import { removePanels, createPanels, updatePanels } from './modules/panel/index.js';
import { initPanels, setPanelForNodes, updatePanelNumNodes, updatePanelBBoxSize } from './modules/panel/helper.js';
import { applyLayoutCircular, applyELKLayout, applyLayoutConcentric, applyLayoutForce, applyLayoutDagre, applyLayoutParallel } from './modules/layout.js';

class Graph extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = GraphDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new GraphDataModel();
        this._isFirstRender = true;
        this._shouldRecalculateLayout = false;
        this._shouldSetPanels = false;
        this._isAutoFitDisabled = false;
        this._isDragging = false;
        this.events = {
            [Graph.selectors.background]: {
                click: this._onBackgroundClick.bind(this),
            },
            [Graph.selectors.node]: {
                click: this._onNodeClick.bind(this),
                mouseover: this._onNodeMouseOver.bind(this),
                mouseout: this._onNodeMouseOut.bind(this),
            },
            [Graph.selectors.link]: {
                click: this._onLinkClick.bind(this),
                mouseover: this._onLinkMouseOver.bind(this),
                mouseout: this._onLinkMouseOut.bind(this),
            },
        };
        if (config)
            this.setConfig(config);
        this._backgroundRect = this.g.append('rect').attr('class', background);
        this._graphGroup = this.g.append('g').attr('class', graphGroup);
        this._zoomBehavior = zoom()
            .scaleExtent(this.config.zoomScaleExtent)
            .on('zoom', (e) => this._onZoom(e.transform, e));
        this._panelsGroup = this._graphGroup.append('g').attr('class', panels);
        this._linksGroup = this._graphGroup.append('g').attr('class', links);
        this._nodesGroup = this._graphGroup.append('g').attr('class', nodes);
        this._defs = this._graphGroup.append('defs');
        this._getMarkerId = this._getMarkerId.bind(this);
    }
    get selectedNode() {
        return this._selectedNode;
    }
    get selectedLink() {
        return this._selectedLink;
    }
    setData(data) {
        const { config } = this;
        this.datamodel.nodeSort = config.nodeSort;
        this.datamodel.data = data;
        this._shouldRecalculateLayout = true;
        if (config.layoutAutofit)
            this._shouldFitLayout = true;
        this._shouldSetPanels = true;
        this._addSVGDefs();
    }
    setConfig(config) {
        this._shouldRecalculateLayout = this._shouldRecalculateLayout || this._shouldLayoutRecalculate(config);
        this._shouldFitLayout = this._shouldFitLayout || this._shouldRecalculateLayout;
        super.setConfig(config);
        this._shouldSetPanels = true;
    }
    get bleed() {
        const extraPadding = 50; // Extra padding to take into account labels and selection outlines
        return { top: extraPadding, bottom: extraPadding, left: extraPadding, right: extraPadding };
    }
    _render(customDuration) {
        const { config: { disableZoom, duration, layoutAutofit, panels }, datamodel } = this;
        if (!datamodel.nodes && !datamodel.links)
            return;
        const animDuration = isNumber(customDuration) ? customDuration : duration;
        this._backgroundRect
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('opacity', 0);
        if ((this._prevWidth !== this._width || this._prevHeight !== this._height) && layoutAutofit) {
            // Fit layout on resize
            this._shouldFitLayout = true;
            this._prevWidth = this._width;
            this._prevHeight = this._height;
        }
        // Apply layout and render
        this._calculateLayout().then((isFirstRender) => {
            // If the component has been destroyed while the layout calculation
            // was in progress, we cancel the render
            if (this.isDestroyed())
                return;
            if (this._shouldSetPanels) {
                smartTransition(this._panelsGroup, duration / 2)
                    .style('opacity', (panels === null || panels === void 0 ? void 0 : panels.length) ? 1 : 0);
                this._panels = initPanels(panels);
                setPanelForNodes(this._panels, datamodel.nodes, this.config);
                this._shouldSetPanels = false;
            }
            if (isFirstRender) {
                this._fit();
                this._shouldFitLayout = false;
            }
            else if (this._shouldFitLayout && !this._isAutoFitDisabled) {
                this._fit(duration);
                this._shouldFitLayout = false;
            }
            // Draw
            this._drawNodes(animDuration);
            this._drawLinks(animDuration);
            // Select Links / Nodes
            this._resetSelection();
            if (this.config.selectedNodeId) {
                const selectedNode = datamodel.nodes.find(node => node.id === this.config.selectedNodeId);
                this._selectNode(selectedNode);
            }
            if (this.config.selectedLinkId) {
                const selectedLink = datamodel.links.find(link => link.id === this.config.selectedLinkId);
                this._selectLink(selectedLink);
            }
            // Link flow animation timer
            if (!this._timer) {
                const refreshRateMs = 35;
                this._timer = interval(this._onLinkFlowTimerFrame.bind(this), refreshRateMs);
            }
            // Zoom
            if (disableZoom)
                this.g.on('.zoom', null);
            else
                this.g.call(this._zoomBehavior).on('dblclick.zoom', null);
            if (!this._isFirstRender && !disableZoom) {
                const transform = zoomTransform(this.g.node());
                this._onZoom(transform);
            }
            // While the graph is animating we disable pointer events on the graph group
            if (animDuration) {
                this._graphGroup.attr('pointer-events', 'none');
            }
            smartTransition(this._graphGroup, animDuration)
                .on('end interrupt', () => {
                this._graphGroup.attr('pointer-events', null);
            });
            // We need to set up events and attributes again because the rendering might have been delayed by the layout
            // calculation and they were not set up properly (see the render function of `ComponentCore`)
            this._setUpComponentEventsThrottled();
            this._setCustomAttributesThrottled();
        });
        this._isFirstRender = false;
    }
    _drawNodes(duration) {
        const { config, datamodel } = this;
        const nodes = datamodel.nodes;
        const nodeGroups = this._nodesGroup
            .selectAll(`.${gNode}:not(.${gNodeExit})`)
            .data(nodes, d => String(d._id));
        const nodeGroupsEnter = nodeGroups.enter().append('g')
            .attr('class', gNode)
            .call(createNodes, config, duration);
        const nodeGroupsMerged = nodeGroups.merge(nodeGroupsEnter);
        const nodeUpdateSelection = updateNodes(nodeGroupsMerged, config, duration, this._scale);
        this._drawPanels(nodeUpdateSelection, duration);
        const nodesGroupExit = nodeGroups.exit();
        nodesGroupExit
            .classed(gNodeExit, true)
            .call(removeNodes, config, duration);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const thisRef = this;
        if (!config.disableDrag) {
            const dragBehaviour = drag()
                .on('start', function (event, d) { thisRef._onDragStarted(d, event, select(this)); })
                .on('drag', function (event, d) { thisRef._onDragged(d, event, nodeGroupsMerged); })
                .on('end', function (event, d) { thisRef._onDragEnded(d, event, select(this)); });
            nodeGroupsMerged.call(dragBehaviour);
        }
        else {
            nodeGroupsMerged.on('.drag', null);
        }
    }
    _drawLinks(duration) {
        const { config, datamodel: { links } } = this;
        const linkGroups = this._linksGroup
            .selectAll(`.${gLink}`)
            .data(links, (d) => String(d._id));
        const linkGroupsEnter = linkGroups.enter().append('g')
            .attr('class', gLink)
            .call(createLinks, config, duration);
        const linkGroupsMerged = linkGroups.merge(linkGroupsEnter);
        linkGroupsMerged.call(updateLinks, config, duration, this._scale, this._getMarkerId);
        const linkGroupsExit = linkGroups.exit();
        linkGroupsExit
            .attr('class', gLinkExit)
            .call(removeLinks, config, duration);
    }
    _drawPanels(nodeUpdateSelection, duration) {
        const { config } = this;
        if (!this._panels)
            return;
        const selection = (nodeUpdateSelection.duration)
            ? nodeUpdateSelection.selection()
            : nodeUpdateSelection;
        updatePanelNumNodes(selection, this._panels, config);
        updatePanelBBoxSize(selection, this._panels, config);
        const panelData = this._panels.filter(p => p._numNodes);
        const panelGroup = this._panelsGroup
            .selectAll(`.${gPanel}`)
            .data(panelData, p => p.label);
        const panelGroupExit = panelGroup.exit();
        panelGroupExit.call(removePanels, config, duration);
        const panelGroupEnter = panelGroup.enter().append('g')
            .attr('class', gPanel)
            .call(createPanels, selection);
        const panelGroupMerged = panelGroup.merge(panelGroupEnter);
        this._updatePanels(panelGroupMerged, duration);
    }
    _updatePanels(panelToUpdate, duration) {
        const { config } = this;
        if (!this._panels)
            return;
        panelToUpdate.call(updatePanels, config, duration);
    }
    _calculateLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { config, datamodel } = this;
            const firstRender = this._isFirstRender;
            if (this._shouldRecalculateLayout) {
                switch (config.layoutType) {
                    case GraphLayoutType.Parallel:
                        applyLayoutParallel(datamodel, config, this._width, this._height);
                        break;
                    case GraphLayoutType.ParallelHorizontal:
                        applyLayoutParallel(datamodel, config, this._width, this._height, 'horizontal');
                        break;
                    case GraphLayoutType.Dagre:
                        yield applyLayoutDagre(datamodel, config, this._width);
                        break;
                    case GraphLayoutType.Force:
                        yield applyLayoutForce(datamodel, config, this._width);
                        break;
                    case GraphLayoutType.Concentric:
                        applyLayoutConcentric(datamodel, config, this._width, this._height);
                        break;
                    case GraphLayoutType.Elk:
                        yield applyELKLayout(datamodel, config, this._width);
                        break;
                    case GraphLayoutType.Circular:
                    default:
                        applyLayoutCircular(datamodel, config, this._width, this._height);
                        break;
                }
                this._shouldRecalculateLayout = false;
            }
            return firstRender;
        });
    }
    _fit(duration = 0) {
        var _a;
        const { datamodel: { nodes } } = this;
        if ((nodes === null || nodes === void 0 ? void 0 : nodes.length) && ((_a = this.g) === null || _a === void 0 ? void 0 : _a.size())) {
            const transform = this._getTransform(nodes);
            smartTransition(this.g, duration)
                .call(this._zoomBehavior.transform, transform);
            this._onZoom(transform);
        }
        else {
            console.warn('Unovis | Graph: Node data is not defined. Check if the component has been initialized.');
        }
    }
    _getTransform(nodes) {
        const { nodeSize, zoomScaleExtent } = this.config;
        const { left, top, right, bottom } = this.bleed;
        const maxNodeSize = getMaxNodeSize(nodes, nodeSize);
        const w = this._width;
        const h = this._height;
        const xExtent = [
            min(nodes, d => { var _a; return getX(d) - maxNodeSize / 2 - (max((_a = d._panels) === null || _a === void 0 ? void 0 : _a.map(p => p._padding.left)) || 0); }),
            max(nodes, d => { var _a; return getX(d) + maxNodeSize / 2 + (max((_a = d._panels) === null || _a === void 0 ? void 0 : _a.map(p => p._padding.right)) || 0); }),
        ];
        const yExtent = [
            min(nodes, d => { var _a; return getY(d) - maxNodeSize / 2 - (max((_a = d._panels) === null || _a === void 0 ? void 0 : _a.map(p => p._padding.top)) || 0); }),
            max(nodes, d => { var _a; return getY(d) + maxNodeSize / 2 + (max((_a = d._panels) === null || _a === void 0 ? void 0 : _a.map(p => p._padding.bottom)) || 0); }),
        ];
        const xScale = w / (xExtent[1] - xExtent[0] + left + right);
        const yScale = h / (yExtent[1] - yExtent[0] + top + bottom);
        const clampedScale = clamp(min([xScale, yScale]), zoomScaleExtent[0], zoomScaleExtent[1]);
        const xCenter = (xExtent[1] + xExtent[0]) / 2;
        const yCenter = (yExtent[1] + yExtent[0]) / 2;
        const translateX = this._width / 2 - xCenter * clampedScale;
        const translateY = this._height / 2 - yCenter * clampedScale;
        const transform = zoomIdentity
            .translate(translateX, translateY)
            .scale(clampedScale);
        return transform;
    }
    _selectNode(node) {
        const { datamodel: { nodes, links } } = this;
        if (!node)
            console.warn('Unovis | Graph: Select Node: Not found');
        this._selectedNode = node;
        // Apply grey out
        // Grey out all nodes
        nodes.forEach(n => {
            n._state.selected = false;
            n._state.greyout = true;
        });
        // Grey out all links
        links.forEach(l => {
            l._state.greyout = true;
            l._state.selected = false;
        });
        // Highlight selected
        if (node) {
            node._state.selected = true;
            node._state.greyout = false;
            const connectedLinks = links.filter(l => (l.source === node) || (l.target === node));
            connectedLinks.forEach(l => {
                const source = l.source;
                const target = l.target;
                source._state.greyout = false;
                target._state.greyout = false;
                l._state.greyout = false;
            });
        }
        this._updateSelectedElements();
    }
    _selectLink(link) {
        const { datamodel: { nodes, links } } = this;
        if (!link)
            console.warn('Unovis: Graph: Select Link: Not found');
        this._selectedLink = link;
        const selectedLinkSource = link === null || link === void 0 ? void 0 : link.source;
        const selectedLinkTarget = link === null || link === void 0 ? void 0 : link.target;
        // Apply grey out
        nodes.forEach(n => {
            n._state.selected = false;
            n._state.greyout = true;
            if ((selectedLinkTarget === null || selectedLinkTarget === void 0 ? void 0 : selectedLinkTarget._id) === n._id || (selectedLinkSource === null || selectedLinkSource === void 0 ? void 0 : selectedLinkSource._id) === n._id) {
                link._state.greyout = false;
            }
        });
        links.forEach(l => {
            l._state.greyout = true;
            const source = l.source;
            const target = l.target;
            if ((source._id === (selectedLinkSource === null || selectedLinkSource === void 0 ? void 0 : selectedLinkSource._id)) && (target._id === (selectedLinkTarget === null || selectedLinkTarget === void 0 ? void 0 : selectedLinkTarget._id))) {
                source._state.greyout = false;
                target._state.greyout = false;
                l._state.greyout = false;
            }
        });
        links.forEach(l => {
            delete l._state.selected;
        });
        if (link)
            link._state.selected = true;
        this._updateSelectedElements();
    }
    _resetSelection() {
        const { datamodel: { nodes, links } } = this;
        this._selectedNode = undefined;
        this._selectedLink = undefined;
        // Disable Grayout
        nodes.forEach(n => {
            delete n._state.selected;
            delete n._state.greyout;
        });
        links.forEach(l => {
            delete l._state.greyout;
            delete l._state.selected;
        });
        this._updateSelectedElements();
    }
    _updateSelectedElements() {
        const { config } = this;
        const linkElements = this._linksGroup.selectAll(`.${gLink}`);
        linkElements.call(updateSelectedLinks, config, this._scale);
        const nodeElements = this._nodesGroup.selectAll(`.${gNode}`);
        nodeElements.call(updateSelectedNodes, config);
        // this._drawPanels(nodeElements, 0)
    }
    _onBackgroundClick() {
        this._resetSelection();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onNodeClick(d) {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onNodeMouseOut(d) {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onNodeMouseOver(d) {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onLinkClick(d) {
    }
    _onLinkMouseOver(d) {
        if (this._isDragging)
            return;
        d._state.hovered = true;
        this._updateSelectedElements();
    }
    _onLinkMouseOut(d) {
        if (this._isDragging)
            return;
        delete d._state.hovered;
        this._updateSelectedElements();
    }
    _onLinkFlowTimerFrame(elapsed = 0) {
        const { config: { linkFlow, linkFlowAnimDuration }, datamodel: { links } } = this;
        const hasLinksWithFlow = links.some((d, i) => getBoolean(d, linkFlow, i));
        if (!hasLinksWithFlow)
            return;
        const t = (elapsed % linkFlowAnimDuration) / linkFlowAnimDuration;
        const linkElements = this._linksGroup.selectAll(`.${gLink}`);
        const linksToAnimate = linkElements.filter(d => !d._state.greyout);
        linksToAnimate.each(d => { d._state.flowAnimTime = t; });
        animateLinkFlow(linksToAnimate, this.config, this._scale);
    }
    _onZoom(t, event) {
        const { config, datamodel: { nodes } } = this;
        const transform = t || event.transform;
        this._scale = transform.k;
        this._graphGroup.attr('transform', transform.toString());
        if (isFunction(config.onZoom))
            config.onZoom(this._scale, config.zoomScaleExtent);
        if (!this._initialTransform)
            this._initialTransform = transform;
        // If the event was triggered by a mouse interaction (pan or zoom) we don't
        //   refit the layout after recalculation (e.g. on container resize)
        if (event === null || event === void 0 ? void 0 : event.sourceEvent) {
            const diff = Object.keys(transform).reduce((acc, prop) => {
                const propVal = transform[prop];
                const initialPropVal = this._initialTransform[prop];
                const dVal = Math.abs(propVal - initialPropVal);
                return prop === 'k' ? 2 * dVal : dVal / 50;
            }, 0);
            if (diff > config.layoutAutofitTolerance)
                this._isAutoFitDisabled = true;
            else
                this._isAutoFitDisabled = false;
        }
        this._nodesGroup.selectAll(`.${gNode}`)
            .call((nodes.length > config.zoomThrottledUpdateNodeThreshold ? zoomNodesThrottled : zoomNodes), config, this._scale);
        this._linksGroup.selectAll(`.${gLink}`)
            .call((nodes.length > config.zoomThrottledUpdateNodeThreshold ? zoomLinksThrottled : zoomLinks), config, this._scale, this._getMarkerId);
    }
    _onDragStarted(d, event, nodeSelection) {
        const { config } = this;
        this._isDragging = true;
        d._state.isDragged = true;
        nodeSelection.call(updateNodes, config, 0, this._scale);
    }
    _onDragged(d, event, allNodesSelection) {
        var _a, _b;
        const { config } = this;
        const transform = zoomTransform(this.g.node());
        const scale = transform.k;
        // Prevent the node from being dragged offscreen or outside its panel
        const panels = (_b = (_a = this._panels) === null || _a === void 0 ? void 0 : _a.filter(p => p.nodes.includes(d._id))) !== null && _b !== void 0 ? _b : [];
        const nodeSizeValue = getNodeSize(d, config.nodeSize, d._index);
        const maxY = min([(this._height - transform.y) / scale, ...panels.map(p => p._y + p._height)]) - nodeSizeValue / 2;
        const maxX = min([(this._width - transform.x) / scale, ...panels.map(p => p._x + p._width)]) - nodeSizeValue / 2;
        const minY = max([-transform.y / scale, ...panels.map(p => p._y)]) + nodeSizeValue / 2;
        const minX = max([-transform.x / scale, ...panels.map(p => p._x)]) + nodeSizeValue / 2;
        let [x, y] = pointer(event, this._graphGroup.node());
        if (y < minY)
            y = minY;
        else if (y > maxY)
            y = maxY;
        if (x < minX)
            x = minX;
        else if (x > maxX)
            x = maxX;
        // Snap to Layout
        if (Math.sqrt(Math.pow(x - d.x, 2) + Math.pow(y - d.y, 2)) < 15) {
            x = d.x;
            y = d.y;
        }
        // Assign coordinates
        d._state.fx = x;
        d._state.fy = y;
        if (d._state.fx === d.x)
            delete d._state.fx;
        if (d._state.fy === d.y)
            delete d._state.fy;
        // Update affected DOM elements
        const nodeSelection = this._nodesGroup.selectAll(`.${gNode}`);
        const nodeToUpdate = nodeSelection.filter((n) => n._id === d._id);
        nodeToUpdate.call(updateNodes, config, 0, scale);
        const linkSelection = this._linksGroup.selectAll(`.${gLink}`);
        const linksToUpdate = linkSelection.filter((l) => {
            const source = l.source;
            const target = l.target;
            return source._id === d._id || target._id === d._id;
        });
        linksToUpdate.call(updateLinks, config, 0, scale, this._getMarkerId);
        const linksToAnimate = linksToUpdate.filter(d => d._state.greyout);
        if (linksToAnimate.size())
            animateLinkFlow(linksToAnimate, config, this._scale);
    }
    _onDragEnded(d, event, nodeSelection) {
        const { config } = this;
        this._isDragging = false;
        d._state.isDragged = false;
        nodeSelection.call(updateNodes, config, 0, this._scale);
    }
    _shouldLayoutRecalculate(nextConfig) {
        const { config } = this;
        if (config.layoutType !== nextConfig.layoutType)
            return true;
        if (config.layoutNonConnectedAside !== nextConfig.layoutNonConnectedAside)
            return true;
        if (config.layoutType === GraphLayoutType.Force) {
            const forceSettingsDiff = shallowDiff(config.forceLayoutSettings, nextConfig.forceLayoutSettings);
            if (Object.keys(forceSettingsDiff).length)
                return true;
        }
        if (config.layoutType === GraphLayoutType.Dagre) {
            const dagreSettingsDiff = shallowDiff(config.dagreLayoutSettings, nextConfig.dagreLayoutSettings);
            if (Object.keys(dagreSettingsDiff).length)
                return true;
        }
        if (config.layoutType === GraphLayoutType.Parallel ||
            config.layoutType === GraphLayoutType.ParallelHorizontal ||
            config.layoutType === GraphLayoutType.Concentric) {
            if (config.layoutGroupOrder !== nextConfig.layoutGroupOrder)
                return true;
            if (config.layoutParallelNodesPerColumn !== nextConfig.layoutParallelNodesPerColumn)
                return true;
            if (config.layoutParallelSortConnectionsByGroup !== nextConfig.layoutParallelSortConnectionsByGroup)
                return true;
        }
        return false;
    }
    _getMarkerId(d, color, arrow) {
        const { config } = this;
        const c = color !== null && color !== void 0 ? color : getLinkColor(d, config);
        const a = arrow !== null && arrow !== void 0 ? arrow : getLinkArrow(d, this._scale, config);
        return a && c ? `${this.uid}-${stringToHtmlId(c)}-${a}` : null;
    }
    _addSVGDefs() {
        const { datamodel: { links } } = this;
        // Clean up old defs
        this._defs.selectAll('*').remove();
        // Get all variations of link colors to create markers
        const linkColors = unique(clean(links.map(d => getLinkColor(d, this.config))));
        this._defs.selectAll('marker')
            .data([
            ...linkColors.map(d => ({ color: d, arrow: GraphLinkArrowStyle.Single })),
            ...linkColors.map(d => ({ color: d, arrow: GraphLinkArrowStyle.Double })), // Double-sided arrows
        ]).enter()
            .append('marker')
            .attr('id', d => this._getMarkerId(null, d.color, d.arrow))
            .attr('orient', 'auto')
            .attr('markerWidth', d => d.arrow === GraphLinkArrowStyle.Double ? LINK_MARKER_WIDTH * 2 : LINK_MARKER_WIDTH)
            .attr('markerHeight', d => d.arrow === GraphLinkArrowStyle.Double ? LINK_MARKER_HEIGHT * 2 : LINK_MARKER_HEIGHT)
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('refX', LINK_MARKER_WIDTH - LINK_MARKER_HEIGHT / 2)
            .attr('refY', LINK_MARKER_HEIGHT - LINK_MARKER_HEIGHT / 2)
            .html(d => {
            var _a;
            return `
          <path
            d="${d.arrow === GraphLinkArrowStyle.Double ? getDoubleArrowPath() : getArrowPath()}"
            fill="${(_a = d.color) !== null && _a !== void 0 ? _a : null}"
          />
        `;
        });
    }
    zoomIn(increment = 0.3) {
        const scaleBy = 1 + increment;
        smartTransition(this.g, this.config.duration / 2)
            .call(this._zoomBehavior.scaleBy, scaleBy);
    }
    zoomOut(increment = 0.3) {
        const scaleBy = 1 - increment;
        smartTransition(this.g, this.config.duration / 2)
            .call(this._zoomBehavior.scaleBy, scaleBy);
    }
    setZoom(zoomLevel) {
        smartTransition(this.g, this.config.duration / 2)
            .call(this._zoomBehavior.scaleTo, zoomLevel);
    }
    fitView() {
        this._fit(this.config.duration / 2);
    }
    /** Enable automatic fitting to container if it was disabled due to previous zoom / pan interactions */
    resetAutofitState() {
        this._isAutoFitDisabled = false;
    }
    /** Get current coordinates of the nodes as an array of { id: string; x: number; y: number } objects */
    getNodesCoordinates() {
        const { datamodel: { nodes } } = this;
        return nodes.map(n => ({
            id: n._id,
            x: n.x,
            y: n.y,
        }));
    }
    /** Get node coordinates by id as { id: string; x: number; y: number } */
    getNodeCoordinatesById(id) {
        const { datamodel: { nodes } } = this;
        const node = nodes.find(n => n._id === id);
        if (!node) {
            console.warn(`Unovis | Graph: Node ${id} not found`);
            return undefined;
        }
        else {
            return {
                id: node._id,
                x: node.x,
                y: node.y,
            };
        }
    }
}
Graph.selectors = {
    root: root,
    background: background,
    node: gNode,
    nodeShape: node,
    nodeGauge: nodeGauge,
    nodeSideLabel: sideLabelGroup,
    nodeLabel: label,
    link: gLink,
    linkLine: link,
    panel: gPanel,
    panelRect: panel,
    panelSelection: panelSelection,
    panelLabel: label$1,
    panelLabelText: labelText,
    panelSideIcon: sideIconGroup,
    panelSideIconShape: sideIconShape,
    panelSideIconSymbol: sideIconSymbol,
};
Graph.nodeSelectors = style;

export { Graph };
//# sourceMappingURL=index.js.map
