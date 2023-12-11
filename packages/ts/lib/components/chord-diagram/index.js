import { max } from 'd3-array';
import { nest } from 'd3-collection';
import { partition, hierarchy } from 'd3-hierarchy';
import { scalePow } from 'd3-scale';
import { arc } from 'd3-shape';
import { ComponentCore } from '../../core/component/index.js';
import { GraphDataModel } from '../../data-models/graph.js';
import { getValue, getString, getNumber, isNumber, groupBy } from '../../utils/data.js';
import { estimateStringPixelLength } from '../../utils/text.js';
import { ChordLabelAlignment } from './types.js';
import { ChordDiagramDefaultConfig } from './config.js';
import { createNode, updateNode, removeNode } from './modules/node.js';
import { LABEL_PADDING, createLabel, updateLabel, removeLabel } from './modules/label.js';
import { createLink, updateLink, removeLink } from './modules/link.js';
import * as style from './style.js';
import { links, nodes, labels, transparent, link, highlightedLink, node, highlightedNode, label, labelExit } from './style.js';

class ChordDiagram extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = ChordDiagramDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new GraphDataModel();
        this.arcGen = arc();
        this.radiusScale = scalePow();
        this._nodes = [];
        this._links = [];
        this.events = {
            [ChordDiagram.selectors.node]: {
                mouseover: this._onNodeMouseOver.bind(this),
                mouseout: this._onNodeMouseOut.bind(this),
            },
            [ChordDiagram.selectors.link]: {
                mouseover: this._onLinkMouseOver.bind(this),
                mouseout: this._onLinkMouseOut.bind(this),
            },
            [ChordDiagram.selectors.label]: {
                mouseover: this._onNodeMouseOver.bind(this),
                mouseout: this._onNodeMouseOut.bind(this),
            },
        };
        if (config)
            this.setConfig(config);
        this.linkGroup = this.g.append('g').attr('class', links);
        this.nodeGroup = this.g.append('g').attr('class', nodes);
        this.labelGroup = this.g.append('g').attr('class', labels);
    }
    get _forceHighlight() {
        var _a;
        return this.config.highlightedNodeId !== undefined || ((_a = this.config.highlightedLinkIds) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    get bleed() {
        const { config } = this;
        const padding = 4 + LABEL_PADDING * 2;
        let top = 0;
        let bottom = 0;
        let right = 0;
        let left = 0;
        this._nodes.forEach(n => {
            var _a;
            const nodeLabelAlignment = getValue(n.data, config.nodeLabelAlignment);
            if (n.height === 0 && nodeLabelAlignment === ChordLabelAlignment.Perpendicular) {
                const labelWidth = estimateStringPixelLength((_a = getString(n.data, config.nodeLabel)) !== null && _a !== void 0 ? _a : '', 16);
                const [x, y] = this.arcGen.centroid(n);
                if (x < 0)
                    left = Math.max(left, labelWidth);
                else
                    right = Math.max(right, labelWidth);
                if (y < 0)
                    top = Math.max(top, labelWidth);
                else
                    bottom = Math.max(bottom, labelWidth);
            }
        });
        left += padding;
        right += padding;
        bottom += padding;
        top += padding;
        return { top, bottom, left, right };
    }
    setSize(width, height, containerWidth, containerHeight) {
        super.setSize(width, height, containerWidth, containerHeight);
        // Setting radius for initial bleed calculation. This ensures the correct radius is set when render is called
        this.radiusScale
            .exponent(this.config.radiusScaleExponent)
            .range([0, Math.min(width, height) / 2]);
    }
    setData(data) {
        super.setData(data);
        const hierarchyData = this._getHierarchyNodes();
        const partitionData = partition()
            .size([this.config.angleRange[1], 1])(hierarchyData);
        partitionData.each((node, i) => {
            this._calculateRadialPosition(node, getNumber(node.data, this.config.padAngle));
            // Add hierarchy data for non leaf nodes
            if (node.children) {
                node.data = Object.assign(node.data, {
                    depth: node.depth,
                    height: node.height,
                    value: node.value,
                    ancestors: node.ancestors().map(d => d.data.key),
                });
            }
            node.x0 = Number.isNaN(node.x0) ? 0 : node.x0;
            node.x1 = Number.isNaN(node.x1) ? 0 : node.x1;
            node.uid = `${this.uid}-n${i}`;
            node._state = {};
        });
        const partitionDataWithRoot = partitionData.descendants();
        this._rootNode = partitionDataWithRoot.find(d => d.depth === 0);
        this._nodes = partitionDataWithRoot.filter(d => d.depth !== 0); // Filter out the root node
        this._links = this._getRibbons(partitionData);
    }
    _render(customDuration) {
        super._render(customDuration);
        const { config, bleed } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const size = Math.min(this._width, this._height);
        const radius = size / 2 - max([bleed.top, bleed.bottom, bleed.left, bleed.right]);
        this.radiusScale.range([0, radius]);
        this.arcGen
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .cornerRadius(d => getNumber(d.data, config.cornerRadius))
            .innerRadius(d => this.radiusScale(d.y1) - getNumber(d, config.nodeWidth))
            .outerRadius(d => this.radiusScale(d.y1));
        // Center the view
        this.g.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.g.classed(transparent, this._forceHighlight);
        // Links
        const linksSelection = this.linkGroup
            .selectAll(`.${link}`)
            .data(this._links, d => String(d.data._id))
            .classed(highlightedLink, l => {
            var _a, _b;
            const linkId = (_a = l.data.id) !== null && _a !== void 0 ? _a : l.data._indexGlobal;
            return (_b = config.highlightedLinkIds) === null || _b === void 0 ? void 0 : _b.includes(linkId);
        });
        const linksEnter = linksSelection.enter().append('path')
            .attr('class', link)
            .call(createLink, this.radiusScale);
        const linksMerged = linksSelection.merge(linksEnter);
        linksMerged.call(updateLink, config, this.radiusScale, duration);
        linksSelection.exit()
            .call(removeLink, duration);
        // Nodes
        const nodesSelection = this.nodeGroup
            .selectAll(`.${node}`)
            .data(this._nodes, d => String(d.uid))
            .classed(highlightedNode, d => config.highlightedNodeId === d.data._id);
        const nodesEnter = nodesSelection.enter().append('path')
            .attr('class', node)
            .call(createNode, config);
        const nodesMerged = nodesSelection.merge(nodesEnter);
        nodesMerged.call(updateNode, config, this.arcGen, duration, this.bleed);
        nodesSelection.exit()
            .call(removeNode, duration);
        // Labels
        const labelWidth = size - radius - config.nodeWidth;
        const labels = this.labelGroup
            .selectAll(`.${label}`)
            .data(this._nodes, d => String(d.uid));
        const labelEnter = labels.enter().append('g')
            .attr('class', label)
            .call(createLabel, config, this.radiusScale);
        const labelsMerged = labels.merge(labelEnter);
        labelsMerged.call(updateLabel, config, labelWidth, this.radiusScale, duration);
        labels.exit()
            .attr('class', labelExit)
            .call(removeLabel, duration);
    }
    _getHierarchyNodes() {
        const { config, datamodel: { nodes, links } } = this;
        nodes.forEach(n => { delete n._state.value; });
        links.forEach(l => {
            delete l._state.points;
            l.source._state.value = (l.source._state.value || 0) + getNumber(l, config.linkValue);
            l.target._state.value = (l.target._state.value || 0) + getNumber(l, config.linkValue);
        });
        // TODO: Replace with d3-group
        const nestGen = nest();
        config.nodeLevels.forEach(levelAccessor => {
            nestGen.key((d) => d[levelAccessor]);
        });
        const root = { key: 'root', values: nestGen.entries(nodes) };
        const hierarchyNodes = hierarchy(root, d => d.values)
            .sum((d) => { var _a; return (_a = d._state) === null || _a === void 0 ? void 0 : _a.value; });
        return hierarchyNodes;
    }
    _getRibbons(partitionData) {
        const { config, datamodel: { links } } = this;
        const findNode = (nodes, id) => nodes.find(n => n.data._id === id);
        const leafNodes = partitionData.leaves();
        const groupedBySource = groupBy(links, d => d.source._id);
        const groupedByTarget = groupBy(links, d => d.target._id);
        const getNodesInRibbon = (source, target, partitionHeight, nodes = []) => {
            nodes[source.height] = source;
            nodes[partitionHeight * 2 - target.height] = target;
            if (source.parent && target.parent)
                getNodesInRibbon(source.parent, target.parent, partitionHeight, nodes);
            return nodes;
        };
        const calculatePoints = (links, type, depth) => {
            links.forEach(link => {
                var _a;
                if (!link._state.points)
                    link._state.points = [];
                const sourceLeaf = findNode(leafNodes, link.source._id);
                const targetLeaf = findNode(leafNodes, link.target._id);
                const nodesInRibbon = getNodesInRibbon(type === 'out' ? sourceLeaf : targetLeaf, type === 'out' ? targetLeaf : sourceLeaf, partitionData.height);
                const currNode = nodesInRibbon[depth];
                const len = currNode.x1 - currNode.x0;
                const x0 = (_a = currNode._prevX1) !== null && _a !== void 0 ? _a : currNode.x0;
                const x1 = x0 + len * getNumber(link, config.linkValue) / currNode.value;
                currNode._prevX1 = x1;
                const pointIdx = type === 'out' ? depth : partitionData.height * 2 - 1 - depth;
                link._state.points[pointIdx] = {
                    a0: Math.min(x0, x1),
                    a1: Math.max(x0, x1),
                    r: currNode.y1,
                };
            });
        };
        leafNodes.forEach(leafNode => {
            const outLinks = groupedBySource[leafNode.data._id] || [];
            const inLinks = groupedByTarget[leafNode.data._id] || [];
            for (let depth = 0; depth < partitionData.height; depth += 1) {
                calculatePoints(outLinks, 'out', depth);
                calculatePoints(inLinks, 'in', depth);
            }
        });
        const ribbons = links.map(l => {
            const sourceNode = findNode(leafNodes, l.source._id);
            const targetNode = findNode(leafNodes, l.target._id);
            return {
                source: sourceNode,
                target: targetNode,
                data: l,
                points: l._state.points,
                _state: {},
            };
        });
        return ribbons;
    }
    _calculateRadialPosition(hierarchyNode, nodePadding = 0.02, scalingCoeff = 0.95) {
        if (!hierarchyNode.children)
            return;
        // Calculate x0 and x1
        const nodeLength = (hierarchyNode.x1 - hierarchyNode.x0);
        const scaledNodeLength = nodeLength * scalingCoeff;
        const delta = nodeLength - scaledNodeLength;
        let x0 = hierarchyNode.x0 + delta / 2;
        for (const node of hierarchyNode.children) {
            const childX0 = x0;
            const childX1 = x0 + (node.value / hierarchyNode.value) * scaledNodeLength - nodePadding / 2;
            const childNodeLength = childX1 - childX0;
            const scaledChildNodeLength = childNodeLength * scalingCoeff;
            const childDelta = childNodeLength - scaledChildNodeLength;
            node.x0 = childX0 + childDelta / 2;
            node.x1 = node.x0 + scaledChildNodeLength;
            x0 = childX1 + nodePadding / 2 + childDelta / 2;
        }
    }
    _onNodeMouseOver(d) {
        let ribbons;
        if (d.children) {
            const leaves = d.leaves();
            ribbons = this._links.filter(l => leaves.find(leaf => l.source.data.id === leaf.data.id || l.target.data.id === leaf.data.id));
        }
        else {
            const leaf = d;
            ribbons = this._links.filter(l => l.source.data.id === leaf.data.id || l.target.data.id === leaf.data.id);
        }
        this._highlightOnHover(ribbons);
    }
    _onNodeMouseOut() {
        this._highlightOnHover();
    }
    _onLinkMouseOver(d) {
        this._highlightOnHover([d]);
    }
    _onLinkMouseOut() {
        this._highlightOnHover();
    }
    _highlightOnHover(links) {
        if (this._forceHighlight)
            return;
        if (links) {
            links.forEach(l => {
                l._state.hovered = true;
                const sourcePath = l.source.path(this._rootNode);
                const targetPath = l.target.path(this._rootNode);
                sourcePath.forEach(n => { if (n.depth)
                    n._state.hovered = true; });
                targetPath.forEach(n => { if (n.depth)
                    n._state.hovered = true; });
            });
        }
        else {
            this._nodes.forEach(n => { delete n._state.hovered; });
            this._links.forEach(l => { delete l._state.hovered; });
        }
        this.nodeGroup.selectAll(`.${node}`)
            .classed(highlightedNode, d => d._state.hovered);
        this.linkGroup.selectAll(`.${link}`)
            .classed(highlightedLink, d => d._state.hovered);
        this.g.classed(transparent, !!links);
    }
}
ChordDiagram.selectors = style;

export { ChordDiagram };
//# sourceMappingURL=index.js.map
