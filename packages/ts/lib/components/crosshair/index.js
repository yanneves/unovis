import { pointer } from 'd3-selection';
import { easeLinear } from 'd3-ease';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isArray, isNumber, getNearest, clamp, getNumber, isFunction, getStackedValues } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor } from '../../utils/color.js';
import { CrosshairDefaultConfig } from './config.js';
import * as style from './style.js';
import { line, circle } from './style.js';

class Crosshair extends XYComponentCore {
    constructor(config) {
        super();
        this.clippable = true; // Don't apply clipping path to this component. See XYContainer
        this._defaultConfig = CrosshairDefaultConfig;
        this.config = this._defaultConfig;
        this.x = 0;
        this.show = false;
        this._animFrameId = null;
        /** Accessors passed externally (e.g. from XYContainer) */
        this._accessors = {
            x: undefined,
            y: undefined,
            yStacked: undefined,
            baseline: undefined,
        };
        if (config)
            this.setConfig(config);
        this.g.style('opacity', this.show ? 1 : 0);
        this.line = this.g.append('line')
            .attr('class', line);
    }
    set accessors(accessors) { this._accessors = accessors; }
    get accessors() {
        var _a;
        const { config } = this;
        const hasConfig = !!(config.x || config.y || config.yStacked);
        const x = hasConfig ? config.x : this._accessors.x;
        const yAcc = hasConfig ? config.y : this._accessors.y;
        const y = yAcc ? (isArray(yAcc) ? yAcc : [yAcc]) : undefined;
        const yStacked = hasConfig ? config.yStacked : this._accessors.yStacked;
        const baseline = (_a = config.baseline) !== null && _a !== void 0 ? _a : this._accessors.baseline;
        return { x, y, yStacked, baseline };
    }
    setContainer(containerSvg) {
        // Set up mousemove event for Crosshair
        this.container = containerSvg;
        this.container.on('mousemove.crosshair', this._onMouseMove.bind(this));
        this.container.on('mouseout.crosshair', this._onMouseOut.bind(this));
    }
    _render(customDuration) {
        const { config } = this;
        if (config.snapToData && !this.datum)
            return;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        smartTransition(this.g, duration)
            .style('opacity', this.show ? 1 : 0);
        this.line
            .attr('y1', 0)
            .attr('y1', this._height);
        smartTransition(this.line, duration, easeLinear)
            .attr('x1', this.x)
            .attr('x2', this.x);
        const circleData = this.getCircleData();
        const circles = this.g
            .selectAll('circle')
            .data(circleData, (d, i) => { var _a; return (_a = d.id) !== null && _a !== void 0 ? _a : i; });
        const circlesEnter = circles.enter()
            .append('circle')
            .attr('class', circle)
            .attr('r', 0)
            .attr('cx', this.x)
            .attr('cy', d => d.y)
            .style('fill', d => d.color);
        smartTransition(circlesEnter.merge(circles), duration, easeLinear)
            .attr('cx', this.x)
            .attr('cy', d => d.y)
            .attr('r', 4)
            .style('opacity', d => d.opacity)
            .style('fill', d => d.color);
        circles.exit().remove();
    }
    hide() {
        this._onMouseOut();
    }
    _onMouseMove(event) {
        var _a, _b;
        const { config, datamodel, element } = this;
        if (!this.accessors.x && ((_a = datamodel.data) === null || _a === void 0 ? void 0 : _a.length)) {
            console.warn('Unovis | Crosshair: X accessor function has not been configured. Please check if it\'s present in the configuration object');
        }
        const [x] = pointer(event, element);
        const xRange = this.xScale.range();
        if (config.snapToData) {
            if (!this.accessors.y && !this.accessors.yStacked && ((_b = datamodel.data) === null || _b === void 0 ? void 0 : _b.length)) {
                console.warn('Unovis | Crosshair: Y accessors have not been configured. Please check if they\'re present in the configuration object');
            }
            const scaleX = this.xScale;
            const valueX = scaleX.invert(x);
            this.datum = getNearest(datamodel.data, valueX, this.accessors.x);
            this.datumIndex = datamodel.data.indexOf(this.datum);
            if (!this.datum)
                return;
            this.x = clamp(Math.round(scaleX(getNumber(this.datum, this.accessors.x, this.datumIndex))), 0, this._width);
            // Show the crosshair only if it's in the chart range and not far from mouse pointer (if configured)
            this.show = (this.x >= 0) && (this.x <= this._width) && (!config.hideWhenFarFromPointer || (Math.abs(this.x - x) < config.hideWhenFarFromPointerDistance));
        }
        else {
            const tolerance = 2; // Show the crosshair when it is at least 2 pixels close to the chart area
            this.x = clamp(x, xRange[0], xRange[1]);
            this.show = (x >= (xRange[0] - tolerance)) && (x <= (xRange[1] + tolerance));
        }
        window.cancelAnimationFrame(this._animFrameId);
        this._animFrameId = window.requestAnimationFrame(() => {
            this._render();
        });
        if (this.show)
            this._showTooltip(event);
        else
            this._hideTooltip();
    }
    _onMouseOut() {
        this.show = false;
        window.cancelAnimationFrame(this._animFrameId);
        this._animFrameId = window.requestAnimationFrame(() => {
            this._render();
        });
        this._hideTooltip();
    }
    _showTooltip(event) {
        var _a;
        const { config } = this;
        const tooltip = (_a = config.tooltip) !== null && _a !== void 0 ? _a : this.tooltip;
        if (!tooltip)
            return;
        const container = tooltip.getContainer() || this.container.node();
        const [x, y] = tooltip.isContainerBody() ? [event.clientX, event.clientY] : pointer(event, container);
        const content = config.template(this.datum, this.xScale.invert(this.x));
        if (content)
            tooltip.show(content, { x, y });
    }
    _hideTooltip() {
        var _a;
        const { config } = this;
        const tooltip = (_a = config.tooltip) !== null && _a !== void 0 ? _a : this.tooltip;
        tooltip === null || tooltip === void 0 ? void 0 : tooltip.hide();
    }
    // We don't want Crosshair to be be taken in to account in domain calculations
    getYDataExtent() {
        return [undefined, undefined];
    }
    getCircleData() {
        var _a, _b;
        const { config, datamodel: { data } } = this;
        if (isFunction(config.getCircles))
            return config.getCircles(this.xScale.invert(this.x), data, this.yScale);
        if (config.snapToData && this.datum) {
            const yAccessors = (_a = this.accessors.y) !== null && _a !== void 0 ? _a : [];
            const yStackedAccessors = (_b = this.accessors.yStacked) !== null && _b !== void 0 ? _b : [];
            const baselineValue = getNumber(this.datum, this.accessors.baseline, this.datumIndex) || 0;
            const stackedValues = getStackedValues(this.datum, this.datumIndex, ...yStackedAccessors)
                .map((value, index, arr) => ({
                y: this.yScale(value + baselineValue),
                opacity: getNumber(this.datum, yStackedAccessors[index]) ? 1 : 0,
                color: getColor(this.datum, config.color, index),
            }));
            const regularValues = yAccessors
                .map((a, index) => {
                const value = getNumber(this.datum, a);
                return {
                    y: this.yScale(value),
                    opacity: value ? 1 : 0,
                    color: getColor(this.datum, config.color, stackedValues.length + index),
                };
            });
            return stackedValues.concat(regularValues);
        }
        return [];
    }
}
Crosshair.selectors = style;

export { Crosshair };
//# sourceMappingURL=index.js.map
