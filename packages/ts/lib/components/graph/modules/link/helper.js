import { getNumber, getString, getValue } from '../../../../utils/data.js';
import { getColor, hexToBrightness } from '../../../../utils/color.js';
import { color } from 'd3-color';
import { getY, getX } from '../node/helper.js';
import { ZoomLevel } from '../zoom-levels.js';

// Utils
const getPolylineData = (d) => `${d.x1},${d.y1} ${(d.x1 + d.x2) / 2},${(d.y1 + d.y2) / 2} ${d.x2},${d.y2}`;
const LINK_LABEL_RADIUS = 8;
const LINK_MARKER_WIDTH = 12;
const LINK_MARKER_HEIGHT = 8;
function getLinkShift(link, spacing) {
    const sourceNode = link.source;
    const targetNode = link.target;
    const angle = Math.atan2(getY(targetNode) - getY(sourceNode), getX(targetNode) - getX(sourceNode)) - Math.PI / 2;
    const dx = Math.cos(angle) * spacing * link._direction * (link._index - (link._neighbours - 1) / 2);
    const dy = Math.sin(angle) * spacing * link._direction * (link._index - (link._neighbours - 1) / 2);
    return { dx, dy };
}
function getLinkShiftTransform(link, spacing) {
    const { dx, dy } = getLinkShift(link, spacing);
    return `translate(${dx}, ${dy})`;
}
function getLinkLabelShift(link, linkSpacing, shiftFromCenter = 0) {
    const x1 = getX(link.source);
    const y1 = getY(link.source);
    const x2 = getX(link.target);
    const y2 = getY(link.target);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpendicularShift = getLinkShift(link, linkSpacing);
    const x = x1 + 0.5 * (x2 - x1) + shiftFromCenter * Math.cos(angle) + perpendicularShift.dx;
    const y = y1 + 0.5 * (y2 - y1) + shiftFromCenter * Math.sin(angle) + perpendicularShift.dy;
    return `translate(${x}, ${y})`;
}
function getLinkStrokeWidth(d, scale, config) {
    const m = getNumber(d, config.linkWidth, d._indexGlobal);
    return m / Math.pow(scale, 0.5);
}
function getLinkBandWidth(d, scale, config) {
    const { nodeSize, linkBandWidth } = config;
    const sourceNodeSize = getNumber(d.source, nodeSize, d.source._index);
    const targetNodeSize = getNumber(d.target, nodeSize, d.target._index);
    const minNodeSize = Math.min(sourceNodeSize, targetNodeSize);
    return Math.min(minNodeSize, getNumber(d, linkBandWidth, d._indexGlobal) / Math.pow(scale || 1, 0.5)) || 0;
}
function getLinkColor(link, config) {
    var _a;
    const { linkStroke } = config;
    const c = (_a = getColor(link, linkStroke, link._indexGlobal, true)) !== null && _a !== void 0 ? _a : 'var(--vis-graph-link-stroke-color)';
    return c || null;
}
function getLinkArrow(d, scale, config) {
    const { linkArrow } = config;
    if (scale > ZoomLevel.Level2 && getString(d, linkArrow, d._indexGlobal)) {
        return getValue(d, linkArrow, d._indexGlobal);
    }
    return null;
}
function getArrowPath() {
    return `M0,0 V${LINK_MARKER_HEIGHT} L${LINK_MARKER_WIDTH},${LINK_MARKER_HEIGHT / 2} Z`;
}
function getDoubleArrowPath() {
    return `M0,${LINK_MARKER_HEIGHT / 2} L${LINK_MARKER_WIDTH},0 L${LINK_MARKER_WIDTH * 2},${LINK_MARKER_HEIGHT / 2} L${LINK_MARKER_WIDTH},${LINK_MARKER_HEIGHT} Z`;
}
function getLinkLabelTextColor(label) {
    if (!label.color)
        return null;
    const hex = color(label.color).hex();
    const brightness = hexToBrightness(hex);
    return brightness > 0.65 ? 'var(--vis-graph-link-label-text-color-dark)' : 'var(--vis-graph-link-label-text-color-bright)';
}

export { LINK_LABEL_RADIUS, LINK_MARKER_HEIGHT, LINK_MARKER_WIDTH, getArrowPath, getDoubleArrowPath, getLinkArrow, getLinkBandWidth, getLinkColor, getLinkLabelShift, getLinkLabelTextColor, getLinkShift, getLinkShiftTransform, getLinkStrokeWidth, getPolylineData };
//# sourceMappingURL=helper.js.map
