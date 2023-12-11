import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import { trimString } from '../../../../utils/text.js';
import { polygon } from '../../../../utils/path.js';
import { smartTransition } from '../../../../utils/d3.js';
import { getValue, getNumber, getString, getBoolean, throttle } from '../../../../utils/data.js';
import { getColor } from '../../../../utils/color.js';
import { GraphNodeShape } from '../../types.js';
import { getX, getY, getSideLabelTextColor, getNodeSize, getNodeColor, polyTween, arcTween, getNodeIconColor, setLabelRect, LABEL_RECT_VERTICAL_PADDING } from './helper.js';
import { appendShape, updateShape, isCustomXml } from '../shape.js';
import { ZoomLevel } from '../zoom-levels.js';
import { zoomOutLevel2, zoomOutLevel1 } from '../../style.js';
import { node, customNode, nodeSelection, nodeGauge, nodeIcon, label, labelBackground, labelText, labelTextContent, subLabelTextContent, sideLabelsGroup, nodeBottomIcon, greyoutNode, draggable, nodeSelectionActive, sideLabel, sideLabelBackground, nodeIsDragged, nodePolygon, sideLabelGroup } from './style.js';

const SIDE_LABEL_DEFAULT_RADIUS = 10;
function createNodes(selection, config) {
    const { nodeShape } = config;
    selection.each((d, i, elements) => {
        const element = elements[i];
        const group = select(element);
        group
            .attr('transform', (d, i) => {
            var _a, _b, _c;
            const configuredPosition = getValue(d, config.nodeEnterPosition, i);
            const scale = (_a = getNumber(d, config.nodeEnterScale, i)) !== null && _a !== void 0 ? _a : 0;
            const x = (_b = configuredPosition === null || configuredPosition === void 0 ? void 0 : configuredPosition[0]) !== null && _b !== void 0 ? _b : getX(d);
            const y = (_c = configuredPosition === null || configuredPosition === void 0 ? void 0 : configuredPosition[1]) !== null && _c !== void 0 ? _c : getY(d);
            return `translate(${x}, ${y}) scale(${scale})`;
        })
            .attr('opacity', 0);
        const shape = getString(d, nodeShape, d._index);
        /** Todo: The 'nodeShape' storing logic below it a temporary fix, needs a cleaner implementation */
        element.nodeShape = shape;
        appendShape(group, shape, node, customNode, d._index);
        appendShape(group, shape, nodeSelection, customNode, d._index);
        group.append('path').attr('class', nodeGauge);
        group.append('text').attr('class', nodeIcon);
        const label$1 = group.append('g').attr('class', label);
        label$1.append('rect').attr('class', labelBackground);
        const labelText$1 = label$1.append('text')
            .attr('class', labelText)
            .attr('dy', '0.32em');
        labelText$1.append('tspan').attr('class', labelTextContent);
        labelText$1.append('tspan')
            .attr('class', subLabelTextContent)
            .attr('dy', '1.1em')
            .attr('x', '0');
        group.append('g')
            .attr('class', sideLabelsGroup);
        group.append('text')
            .attr('class', nodeBottomIcon);
    });
}
function updateSelectedNodes(selection, config) {
    const { nodeDisabled } = config;
    selection.each((d, i, elements) => {
        const group = select(elements[i]);
        const isGreyout = getBoolean(d, nodeDisabled, d._index) || d._state.greyout;
        group.classed(greyoutNode, isGreyout)
            .classed(draggable, !config.disableDrag);
        const nodeSelectionOutline = group.selectAll(`.${nodeSelection}`);
        nodeSelectionOutline.classed(nodeSelectionActive, d._state.selected);
        group.selectAll(`.${sideLabel}`)
            .style('fill', (l) => isGreyout ? null : getSideLabelTextColor(l, selection.node()));
        group.selectAll(`.${sideLabelBackground}`)
            .style('fill', (l) => isGreyout ? null : l.color);
    });
}
function updateNodes(selection, config, duration, scale = 1) {
    const { nodeGaugeAnimDuration, nodeStrokeWidth, nodeShape, nodeSize, nodeGaugeValue, nodeGaugeFill, nodeIcon: nodeIcon$1, nodeIconSize, nodeLabel, nodeLabelTrim, nodeLabelTrimMode, nodeLabelTrimLength, nodeSubLabel, nodeSubLabelTrim, nodeSubLabelTrimMode, nodeSubLabelTrimLength, nodeSideLabels, nodeStroke, nodeFill, nodeBottomIcon: nodeBottomIcon$1, } = config;
    // Re-create nodes to update shapes if they were changes
    selection.each((d, i, elements) => {
        const element = elements[i];
        const group = select(element);
        const shape = getString(d, nodeShape, d._index);
        if (element.nodeShape !== shape) {
            group.select(`.${node}`).remove();
            appendShape(group, nodeShape, node, customNode, d._index, `.${nodeSelection}`);
            group.select(`.${nodeSelection}`).remove();
            appendShape(group, shape, nodeSelection, null, d._index, `.${nodeGauge}`);
            element.nodeShape = shape;
        }
    });
    // Update nodes themselves
    selection.each((d, i, elements) => {
        var _a, _b, _c;
        const groupElement = elements[i];
        const group = select(groupElement);
        const node$1 = group.select(`.${node}`);
        const nodeArc = group.select(`.${nodeGauge}`);
        const icon = group.select(`.${nodeIcon}`);
        const sideLabelsGroup$1 = group.select(`.${sideLabelsGroup}`);
        const label$1 = group.select(`.${label}`);
        const labelTextContent$1 = label$1.select(`.${labelTextContent}`);
        const sublabelTextContent = label$1.select(`.${subLabelTextContent}`);
        const bottomIcon = group.select(`.${nodeBottomIcon}`);
        const nodeSelectionOutline = group.select(`.${nodeSelection}`);
        const nodeSizeValue = getNodeSize(d, nodeSize, d._index);
        const arcGenerator = arc()
            .innerRadius(state => state.nodeSize / 2 - state.borderWidth / 2)
            .outerRadius(state => state.nodeSize / 2 + state.borderWidth / 2)
            .startAngle(0 * (Math.PI / 180))
            // eslint-disable-next-line dot-notation
            .endAngle(a => a['endAngle']);
        group
            .classed(zoomOutLevel2, scale < ZoomLevel.Level2)
            .classed(nodeIsDragged, (d) => d._state.isDragged);
        // Update Group
        group
            .classed(nodePolygon, () => {
            const shape = getString(d, nodeShape, d._index);
            return shape === GraphNodeShape.Triangle || shape === GraphNodeShape.Hexagon || shape === GraphNodeShape.Square;
        });
        // Update Node
        node$1
            .call(updateShape, nodeShape, nodeSize, d._index)
            .attr('stroke-width', (_a = getNumber(d, nodeStrokeWidth, d._index)) !== null && _a !== void 0 ? _a : 0)
            .style('fill', getNodeColor(d, nodeFill, d._index))
            .style('stroke', (_b = getColor(d, nodeStroke, d._index, true)) !== null && _b !== void 0 ? _b : null);
        const nodeBBox = node$1.node().getBBox();
        nodeArc
            .attr('stroke-width', getNumber(d, nodeStrokeWidth, d._index))
            .style('display', !getNumber(d, nodeGaugeValue, d._index) ? 'none' : null)
            .style('fill', getNodeColor(d, nodeGaugeFill, d._index))
            .style('stroke', getNodeColor(d, nodeGaugeFill, d._index))
            .style('stroke-opacity', d => getString(d, nodeShape, d._index) === GraphNodeShape.Circle ? 0 : null);
        nodeArc
            .transition()
            .duration(nodeGaugeAnimDuration)
            .attrTween('d', (d, j, arr) => {
            switch (getString(d, nodeShape, d._index)) {
                case GraphNodeShape.Circle: return arcTween(d, config, arcGenerator, arr[j]);
                case GraphNodeShape.Hexagon: return polyTween(d, config, polygon, arr[j]);
                case GraphNodeShape.Square: return polyTween(d, config, polygon, arr[j]);
                case GraphNodeShape.Triangle: return polyTween(d, config, polygon, arr[j]);
                default: return null;
            }
        });
        // Set Node Selection
        updateShape(nodeSelectionOutline, nodeShape, nodeSize, d._index);
        // Update Node Icon
        icon
            .style('font-size', `${(_c = getNumber(d, nodeIconSize, d._index)) !== null && _c !== void 0 ? _c : 2.5 * Math.sqrt(nodeSizeValue)}px`)
            .attr('dy', '0.1em')
            .style('fill', getNodeIconColor(d, nodeFill, d._index, selection.node()))
            .html(getString(d, nodeIcon$1, d._index));
        // Side Labels
        const sideLabelsData = getValue(d, nodeSideLabels, d._index) || [];
        const sideLabels = sideLabelsGroup$1.selectAll('g').data(sideLabelsData);
        const sideLabelsEnter = sideLabels.enter().append('g')
            .attr('class', sideLabelGroup);
        sideLabelsEnter.append('circle')
            .attr('class', sideLabelBackground)
            .attr('r', l => { var _a; return (_a = l.radius) !== null && _a !== void 0 ? _a : SIDE_LABEL_DEFAULT_RADIUS; });
        sideLabelsEnter.append('text')
            .attr('class', sideLabel);
        const sideLabelsUpdate = sideLabels.merge(sideLabelsEnter)
            .style('cursor', l => { var _a; return (_a = l.cursor) !== null && _a !== void 0 ? _a : null; });
        // Side label text
        sideLabelsUpdate.select(`.${sideLabel}`).html(d => d.text)
            .attr('dy', '0.1em')
            .style('fill', l => { var _a; return (_a = l.textColor) !== null && _a !== void 0 ? _a : getSideLabelTextColor(l, selection.node()); })
            .style('font-size', l => { var _a, _b; return (_a = l.fontSize) !== null && _a !== void 0 ? _a : `${(2 + ((_b = l.radius) !== null && _b !== void 0 ? _b : SIDE_LABEL_DEFAULT_RADIUS)) / Math.pow(l.text.toString().length, 0.3)}px`; });
        // Side label circle background
        sideLabelsUpdate.select(`.${sideLabelBackground}`)
            .style('fill', l => l.color);
        sideLabelsUpdate.attr('transform', (l, j) => {
            var _a;
            if (sideLabelsData.length === 1)
                return `translate(${nodeSizeValue / 2.5}, ${-nodeSizeValue / 2.5})`;
            const r = 1.05 * nodeSizeValue / 2;
            const angle = j * 1.15 * 2 * Math.atan2((_a = l.radius) !== null && _a !== void 0 ? _a : SIDE_LABEL_DEFAULT_RADIUS, r) - Math.PI / 3;
            return `translate(${r * Math.cos(angle)}, ${r * Math.sin(angle)})`;
        });
        sideLabels.exit().remove();
        // Set label and sub-label text
        const labelText$1 = getString(d, nodeLabel, d._index);
        const sublabelText = getString(d, nodeSubLabel, d._index);
        const labelTextTrimmed = getBoolean(d, nodeLabelTrim, d._index)
            ? trimString(labelText$1, getNumber(d, nodeLabelTrimLength, d._index), getValue(d, nodeLabelTrimMode, d._index))
            : labelText$1;
        const sublabelTextTrimmed = getBoolean(d, nodeSubLabelTrim, d._index)
            ? trimString(sublabelText, getNumber(d, nodeSubLabelTrimLength, d._index), getValue(d, nodeSubLabelTrimMode, d._index))
            : sublabelText;
        labelTextContent$1.text(labelTextTrimmed);
        sublabelTextContent.text(sublabelTextTrimmed);
        group
            .on('mouseenter', () => {
            labelTextContent$1.text(labelText$1);
            sublabelTextContent.text(sublabelText);
            setLabelRect(label$1, labelText$1, labelText);
            group.raise();
        })
            .on('mouseleave', () => {
            labelTextContent$1.text(labelTextTrimmed);
            sublabelTextContent.text(sublabelTextTrimmed);
            setLabelRect(label$1, labelTextTrimmed, labelText);
        });
        // Position label
        const labelFontSize = parseFloat(window.getComputedStyle(groupElement).getPropertyValue('--vis-graph-node-label-font-size')) || 12;
        const labelMargin = LABEL_RECT_VERTICAL_PADDING + 1.25 * Math.pow(labelFontSize, 1.03);
        const nodeHeight = isCustomXml((getString(d, nodeShape, d._index))) ? nodeBBox.height : nodeSizeValue;
        label$1.attr('transform', `translate(0, ${nodeHeight / 2 + labelMargin})`);
        if (scale >= ZoomLevel.Level3)
            setLabelRect(label$1, getString(d, nodeLabel, d._index), labelText);
        // Bottom Icon
        bottomIcon.html(getString(d, nodeBottomIcon$1, d._index))
            .attr('transform', `translate(0, ${nodeHeight / 2})`);
    });
    updateSelectedNodes(selection, config);
    return smartTransition(selection, duration)
        .attr('transform', d => `translate(${getX(d)}, ${getY(d)}) scale(1)`)
        .attr('opacity', 1);
}
function removeNodes(selection, config, duration) {
    smartTransition(selection, duration / 2)
        .attr('opacity', 0)
        .attr('transform', (d, i) => {
        var _a, _b, _c;
        const configuredPosition = getValue(d, config.nodeExitPosition, i);
        const scale = (_a = getNumber(d, config.nodeExitScale, i)) !== null && _a !== void 0 ? _a : 0;
        const x = (_b = configuredPosition === null || configuredPosition === void 0 ? void 0 : configuredPosition[0]) !== null && _b !== void 0 ? _b : getX(d);
        const y = (_c = configuredPosition === null || configuredPosition === void 0 ? void 0 : configuredPosition[1]) !== null && _c !== void 0 ? _c : getY(d);
        return `translate(${x}, ${y}) scale(${scale})`;
    })
        .remove();
}
function setLabelBackgroundRect(selection, config) {
    const { nodeLabel } = config;
    selection.each((d, i, elements) => {
        const group = select(elements[i]);
        const label$1 = group.select(`.${label}`);
        setLabelRect(label$1, getString(d, nodeLabel, i), labelText);
    });
}
const setLabelBackgroundRectThrottled = throttle(setLabelBackgroundRect, 1000);
function zoomNodes(selection, config, scale) {
    selection.classed(zoomOutLevel1, scale < ZoomLevel.Level1);
    selection.classed(zoomOutLevel2, scale < ZoomLevel.Level2);
    selection.selectAll(`${sideLabelBackground}`)
        .attr('transform', `scale(${1 / Math.pow(scale, 0.35)})`);
    selection.selectAll(`.${sideLabel}`)
        .attr('transform', `scale(${1 / Math.pow(scale, 0.45)})`);
    if (scale >= ZoomLevel.Level3)
        selection.call(setLabelBackgroundRectThrottled, config);
}
const zoomNodesThrottled = throttle(zoomNodes, 500);

export { createNodes, removeNodes, updateNodes, updateSelectedNodes, zoomNodes, zoomNodesThrottled };
//# sourceMappingURL=index.js.map
