import { select } from 'd3-selection';
import { min, max } from 'd3-array';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { flatten, getValue, isNumber, getString, getExtent, isArray, getNumber } from '../../utils/data.js';
import { getColor } from '../../utils/color.js';
import { smartTransition } from '../../utils/d3.js';
import { getCSSVariableValueInPixels } from '../../utils/misc.js';
import { ScatterDefaultConfig } from './config.js';
import { createPoints, updatePoints, removePoints } from './modules/point.js';
import { getEstimatedLabelBBox, collideLabels } from './modules/utils.js';
import * as style from './style.js';
import { pointGroup, pointGroupExit, point } from './style.js';

class Scatter extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = ScatterDefaultConfig;
        this.config = this._defaultConfig;
        this.events = {
            [Scatter.selectors.point]: {
                mouseenter: this._onPointMouseOver.bind(this),
                mouseleave: this._onPointMouseOut.bind(this),
            },
        };
        this._pointData = [];
        if (config)
            this.setConfig(config);
    }
    setConfig(config) {
        super.setConfig(config);
        this._updateSizeScale();
    }
    setData(data) {
        super.setData(data);
        this._updateSizeScale();
    }
    get bleed() {
        this._pointData = this._getOnScreenData();
        const pointDataFlat = flatten(this._pointData);
        const yRangeStart = min(this.yScale.range());
        const yRangeEnd = max(this.yScale.range());
        const xRangeStart = this.xScale.range()[0];
        const xRangeEnd = this.xScale.range()[1];
        const fontSizePx = getCSSVariableValueInPixels('var(--vis-scatter-point-label-text-font-size)', this.element);
        const extent = pointDataFlat.reduce((ext, d) => {
            const labelPosition = getValue(d, this.config.labelPosition, d._point.pointIndex);
            const labelBBox = getEstimatedLabelBBox(d, labelPosition, this.xScale, this.yScale, fontSizePx);
            const x = this.xScale(d._point.xValue);
            const y = this.yScale(d._point.yValue);
            const r = d._point.sizePx / 2;
            ext.minX = Math.min(ext.minX, x - r, labelBBox.x);
            ext.maxX = Math.max(ext.maxX, x + r, labelBBox.x + labelBBox.width);
            ext.minY = Math.min(ext.minY, y - r, labelBBox.y);
            ext.maxY = Math.max(ext.maxY, y + r, labelBBox.y + labelBBox.height);
            return ext;
        }, {
            minX: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
        });
        const coeff = 1.2; // Multiplier to take into account subsequent scale range changes and shape irregularities
        const top = extent.minY < yRangeStart ? coeff * (yRangeStart - extent.minY) : 0;
        const bottom = extent.maxY > yRangeEnd ? coeff * (extent.maxY - yRangeEnd) : 0;
        const left = extent.minX < xRangeStart ? coeff * (xRangeStart - extent.minX) : 0;
        const right = extent.maxX > xRangeEnd ? coeff * (extent.maxX - xRangeEnd) : 0;
        return { top, bottom, left, right };
    }
    _render(customDuration) {
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        // Groups
        const pointGroups = this.g
            .selectAll(`.${pointGroup}`)
            .data(this._pointData);
        const pointGroupsEnter = pointGroups
            .enter()
            .append('g')
            .attr('class', pointGroup);
        const pointGroupsMerged = pointGroupsEnter.merge(pointGroups);
        smartTransition(pointGroupsMerged, duration)
            .style('opacity', 1);
        const pointGroupExit$1 = pointGroups.exit().attr('class', pointGroupExit);
        smartTransition(pointGroupExit$1, duration).style('opacity', 0).remove();
        // Points
        const points = pointGroupsMerged
            .selectAll(`.${point}`)
            .data(d => d, d => { var _a; return `${(_a = getString(d, config.id, d._point.pointIndex)) !== null && _a !== void 0 ? _a : d._point.pointIndex}`; });
        const pointsEnter = points.enter().append('g')
            .attr('class', point);
        createPoints(pointsEnter, this.xScale, this.yScale);
        this._points = pointsEnter.merge(points);
        updatePoints(this._points, config, this.xScale, this.yScale, duration);
        removePoints(points.exit(), this.xScale, this.yScale, duration);
        // Take care of overlapping labels
        this._resolveLabelOverlap();
    }
    _resolveLabelOverlap() {
        if (!this.config.labelHideOverlapping) {
            const label = this._points.selectAll('text');
            label.attr('opacity', null);
            return;
        }
        cancelAnimationFrame(this._collideLabelsAnimFrameId);
        this._collideLabelsAnimFrameId = requestAnimationFrame(() => {
            collideLabels(this._points, this.config, this.xScale, this.yScale);
        });
    }
    _updateSizeScale() {
        var _a;
        const { config, datamodel } = this;
        config.sizeScale.domain(getExtent(datamodel.data, config.size));
        config.sizeScale.range((_a = config.sizeRange) !== null && _a !== void 0 ? _a : [0, 0]);
    }
    _getOnScreenData() {
        const { config, datamodel: { data } } = this;
        const xDomain = this.xScale.domain().map((d) => +d); // Convert Date to number
        const yDomain = this.yScale.domain().map((d) => +d); // Convert Date to number
        const yAccessors = (isArray(config.y) ? config.y : [config.y]);
        const maxSizeValue = max(flatten(yAccessors.map((y, j) => data === null || data === void 0 ? void 0 : data.map(d => getNumber(d, config.size, j)))));
        const maxSizePx = config.sizeRange ? config.sizeScale(maxSizeValue) : maxSizeValue;
        const maxSizeXDomain = this.xScale.invert(maxSizePx) - this.xScale.invert(0);
        const maxSizeYDomain = Math.abs(this.yScale.invert(maxSizePx) - this.yScale.invert(0));
        return yAccessors.map((y, j) => {
            var _a;
            return (_a = data === null || data === void 0 ? void 0 : data.reduce((acc, d, i) => {
                const xValue = getNumber(d, config.x, i);
                const yValue = getNumber(d, y, j);
                const pointSize = getNumber(d, config.size, i);
                const pointSizeScaled = config.sizeRange ? config.sizeScale(pointSize) : pointSize;
                const pointSizeXDomain = this.xScale.invert(pointSizeScaled) - this.xScale.invert(0);
                const pointSizeYDomain = Math.abs(this.yScale.invert(pointSizeScaled) - this.yScale.invert(0));
                if (((xValue - pointSizeXDomain / 2) >= (xDomain[0] - maxSizeXDomain / 2)) &&
                    ((xValue + pointSizeXDomain / 2) <= (xDomain[1] + maxSizeXDomain / 2)) &&
                    ((yValue - pointSizeYDomain / 2) >= (yDomain[0] - maxSizeYDomain / 2)) &&
                    ((yValue + pointSizeYDomain / 2) <= (yDomain[1] + maxSizeYDomain / 2))) {
                    acc.push(Object.assign(Object.assign({}, d), { _point: {
                            xValue: xValue,
                            yValue: yValue,
                            sizePx: pointSizeScaled,
                            color: getColor(d, config.color, j),
                            strokeColor: getColor(d, config.strokeColor, j, true),
                            strokeWidthPx: getNumber(d, config.strokeWidth, j),
                            shape: getString(d, config.shape, j),
                            label: getString(d, config.label, j),
                            labelColor: getColor(d, config.labelColor, j),
                            cursor: getString(d, config.cursor, j),
                            groupIndex: j,
                            pointIndex: i,
                        } }));
                }
                return acc;
            }, [])) !== null && _a !== void 0 ? _a : [];
        });
    }
    _onPointMouseOver(d, event) {
        const point = select(event.target);
        const pointNode = point.node();
        if (pointNode)
            pointNode._forceShowLabel = true;
        point.raise();
        this._resolveLabelOverlap();
    }
    _onPointMouseOut(d, event) {
        const pointNode = select(event.target).node();
        if (pointNode)
            delete pointNode._forceShowLabel;
        this._resolveLabelOverlap();
    }
}
Scatter.selectors = style;

export { Scatter };
//# sourceMappingURL=index.js.map
