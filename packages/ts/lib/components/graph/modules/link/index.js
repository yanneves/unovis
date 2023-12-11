import { select } from 'd3-selection';
import { range } from 'd3-array';
import { getBoolean, getValue, throttle } from '../../../../utils/data.js';
import { smartTransition } from '../../../../utils/d3.js';
import { getHref } from '../../../../utils/misc.js';
import { GraphLinkStyle } from '../../types.js';
import { getX, getY } from '../node/helper.js';
import { getLinkBandWidth, getLinkStrokeWidth, getLinkColor, getLinkShiftTransform, getPolylineData, LINK_MARKER_WIDTH, getLinkLabelShift, LINK_LABEL_RADIUS, getLinkLabelTextColor } from './helper.js';
import { ZoomLevel } from '../zoom-levels.js';
import { zoomOutLevel2 } from '../../style.js';
import { linkSupport, link, linkBand, flowGroup, flowCircle, labelGroups, greyout, linkDashed, labelGroup, labelCircle, labelContent } from './style.js';

function createLinks(selection) {
    selection.attr('opacity', 0);
    selection.append('line')
        .attr('class', linkSupport);
    selection.append('polyline')
        .attr('class', link);
    selection.append('line')
        .attr('class', linkBand)
        .attr('x1', d => getX(d.source))
        .attr('y1', d => getY(d.source))
        .attr('x2', d => getX(d.target))
        .attr('y2', d => getY(d.target));
    selection.append('g')
        .attr('class', flowGroup)
        .selectAll(`.${flowCircle}`)
        .data(range(0, 6)).enter()
        .append('circle')
        .attr('class', flowCircle);
    selection.append('g')
        .attr('class', labelGroups);
}
function updateSelectedLinks(selection, config, scale) {
    const isGreyedOut = (d, i) => getBoolean(d, config.linkDisabled, i) || d._state.greyout;
    selection
        .classed(greyout, (d, i) => isGreyedOut(d, i));
    selection.each((d, i, elements) => {
        const element = elements[i];
        const group = select(element);
        group.select(`.${link}`);
        group.select(`.${linkBand}`);
        const linkSupport$1 = group.select(`.${linkSupport}`);
        linkSupport$1
            .style('stroke-opacity', (d._state.hovered || d._state.selected) ? 0.2 : 0)
            .style('stroke-width', d._state.selected
            ? getLinkBandWidth(d, scale, config) + 5
            : d._state.hovered ? getLinkBandWidth(d, scale, config) + 10 : null);
    });
}
function updateLinks(selection, config, duration, scale = 1, getMarkerId) {
    const { linkFlowParticleSize, linkStyle, linkFlow, linkArrow, linkLabel, linkLabelShiftFromCenter } = config;
    if (!selection.size())
        return;
    selection
        .classed(linkDashed, d => getValue(d, linkStyle, d._indexGlobal) === GraphLinkStyle.Dashed);
    selection.each((d, i, elements) => {
        const element = elements[i];
        const linkGroup = select(element);
        const link$1 = linkGroup.select(`.${link}`);
        const linkBand$1 = linkGroup.select(`.${linkBand}`);
        const linkSupport$1 = linkGroup.select(`.${linkSupport}`);
        const flowGroup$1 = linkGroup.select(`.${flowGroup}`);
        const x1 = getX(d.source);
        const y1 = getY(d.source);
        const x2 = getX(d.target);
        const y2 = getY(d.target);
        link$1
            .attr('class', link)
            .attr('marker-mid', getHref(d, getMarkerId))
            .style('stroke-width', getLinkStrokeWidth(d, scale, config))
            .style('stroke', getLinkColor(d, config))
            .attr('transform', getLinkShiftTransform(d, config.linkNeighborSpacing));
        smartTransition(link$1, duration)
            .attr('points', getPolylineData({ x1, y1, x2, y2 }));
        linkBand$1
            .attr('class', linkBand)
            .attr('transform', getLinkShiftTransform(d, config.linkNeighborSpacing))
            .style('stroke-width', getLinkBandWidth(d, scale, config))
            .style('stroke', getLinkColor(d, config));
        smartTransition(linkBand$1, duration)
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);
        linkSupport$1
            .style('stroke', getLinkColor(d, config))
            .attr('transform', getLinkShiftTransform(d, config.linkNeighborSpacing))
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);
        flowGroup$1
            .attr('transform', getLinkShiftTransform(d, config.linkNeighborSpacing))
            .style('display', getBoolean(d, linkFlow, d._indexGlobal) ? null : 'none')
            .style('opacity', 0);
        flowGroup$1
            .selectAll(`.${flowCircle}`)
            .attr('r', linkFlowParticleSize / scale)
            .style('fill', getLinkColor(d, config));
        smartTransition(flowGroup$1, duration)
            .style('opacity', scale < ZoomLevel.Level2 ? 0 : 1);
        // Labels
        const labelGroups$1 = linkGroup.selectAll(`.${labelGroups}`);
        const labelDatum = getValue(d, linkLabel, d._indexGlobal);
        const markerWidth = getValue(d, linkArrow, d._indexGlobal) ? LINK_MARKER_WIDTH * 2 : 0;
        const labelShift = getBoolean(d, linkLabelShiftFromCenter, d._indexGlobal) ? -markerWidth + 4 : 0;
        const labelTranslate = getLinkLabelShift(d, config.linkNeighborSpacing, labelShift);
        const labels = labelGroups$1
            .selectAll(`.${labelGroup}`)
            .data(labelDatum && labelDatum.text ? [labelDatum] : []);
        // Enter
        const labelsEnter = labels.enter().append('g')
            .attr('class', labelGroup)
            .attr('transform', labelTranslate)
            .style('opacity', 0);
        labelsEnter.append('circle')
            .attr('class', labelCircle)
            .attr('r', 0);
        labelsEnter.append('text')
            .attr('class', labelContent);
        // Update
        const labelsUpdate = labels.merge(labelsEnter);
        smartTransition(labelsUpdate.select(`.${labelCircle}`), duration)
            .attr('r', label => { var _a; return (_a = label.radius) !== null && _a !== void 0 ? _a : LINK_LABEL_RADIUS; })
            .style('fill', label => label.color);
        labelsUpdate.select(`.${labelContent}`)
            .text(label => label.text)
            .attr('dy', '0.1em')
            .style('fill', label => { var _a; return (_a = label.textColor) !== null && _a !== void 0 ? _a : getLinkLabelTextColor(label); })
            .style('font-size', label => {
            var _a;
            if (label.fontSize)
                return label.fontSize;
            const radius = (_a = label.radius) !== null && _a !== void 0 ? _a : LINK_LABEL_RADIUS;
            return `${radius / Math.pow(label.text.toString().length, 0.4)}px`;
        });
        smartTransition(labelsUpdate, duration)
            .attr('transform', labelTranslate)
            .style('cursor', label => label.cursor)
            .style('opacity', 1);
        // Exit
        const labelsExit = labels.exit();
        smartTransition(labelsExit.select(`.${labelCircle}`), duration)
            .attr('r', 0);
        smartTransition(labelsExit, duration)
            .style('opacity', 0)
            .remove();
    });
    if (duration > 0) {
        selection.attr('pointer-events', 'none');
        const t = smartTransition(selection, duration);
        t
            .attr('opacity', 1)
            .on('end interrupt', (d, i, elements) => {
            select(elements[i])
                .attr('pointer-events', 'stroke')
                .attr('opacity', 1);
        });
    }
    else {
        selection.attr('opacity', 1);
    }
    updateSelectedLinks(selection, config, scale);
}
function removeLinks(selection, config, duration) {
    smartTransition(selection, duration / 2)
        .attr('opacity', 0)
        .remove();
}
function animateLinkFlow(selection, config, scale) {
    const { linkFlow } = config;
    if (scale < ZoomLevel.Level2)
        return;
    selection.each((d, i, elements) => {
        const element = elements[i];
        const linkGroup = select(element);
        const flowGroup$1 = linkGroup.select(`.${flowGroup}`);
        if (!getBoolean(d, linkFlow, d._indexGlobal))
            return;
        const t = d._state.flowAnimTime;
        const circles = flowGroup$1.selectAll(`.${flowCircle}`);
        circles
            .attr('transform', index => {
            const tt = (t + (+index) / (circles.size() - 1)) % 1;
            const x1 = getX(d.source);
            const y1 = getY(d.source);
            const x2 = getX(d.target);
            const y2 = getY(d.target);
            const x = x1 + tt * (x2 - x1);
            const y = y1 + tt * (y2 - y1);
            return `translate(${x}, ${y})`;
        });
    });
}
function zoomLinks(selection, config, scale, getMarkerId) {
    const { linkFlowParticleSize } = config;
    selection.classed(zoomOutLevel2, scale < ZoomLevel.Level2);
    selection.selectAll(`.${flowCircle}`)
        .attr('r', linkFlowParticleSize / scale);
    const linkElements = selection.selectAll(`.${link}`);
    linkElements
        .attr('marker-mid', d => getHref(d, getMarkerId))
        .style('stroke-width', d => getLinkStrokeWidth(d, scale, config));
    const linkBandElements = selection.selectAll(`.${linkBand}`);
    linkBandElements
        .style('stroke-width', d => getLinkBandWidth(d, scale, config));
}
const zoomLinksThrottled = throttle(zoomLinks, 500);

export { animateLinkFlow, createLinks, removeLinks, updateLinks, updateSelectedLinks, zoomLinks, zoomLinksThrottled };
//# sourceMappingURL=index.js.map
