import { brushX } from 'd3-brush';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isNumber, clamp } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { Arrangement } from '../../types/position.js';
import { BrushDefaultConfig } from './config.js';
import { BrushDirection } from './types.js';
import * as style from './style.js';
import { brush, unselected, handleLine } from './style.js';

class Brush extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = BrushDefaultConfig;
        this.clippable = false; // Don't apply clipping path to this component. See XYContainer
        this.config = this._defaultConfig;
        this.brushBehaviour = brushX();
        this.events = {
            [Brush.selectors.brush]: {},
        };
        this._selection = null;
        this._firstRender = true;
        if (config)
            this.setConfig(config);
        this.brush = this.g
            .append('g')
            .attr('class', brush);
        const directions = [{ type: BrushDirection.West }, { type: BrushDirection.East }];
        this.unselectedRange = this.g
            .selectAll(`.${unselected}`)
            .data(directions)
            .enter().append('rect')
            .attr('class', unselected);
        this.handleLines = this.g
            .selectAll(`.${handleLine}`)
            .data(directions)
            .enter().append('line')
            .attr('class', handleLine);
    }
    _render(customDuration) {
        var _a, _b, _c, _d;
        const { brushBehaviour, config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const xScale = this.xScale;
        brushBehaviour
            .extent([[0, 0], [this._width, this._height]])
            .on('start', this._onBrushStart.bind(this))
            .on('brush', this._onBrushMove.bind(this))
            .on('end', this._onBrushEnd.bind(this));
        this.brush
            .call(brushBehaviour)
            .classed('non-draggable', !config.draggable);
        const yRange = [this._height, 0];
        const h = yRange[0] - yRange[1];
        this.g.selectAll('.handle')
            .attr('y', yRange[1])
            .attr('height', h);
        this.unselectedRange
            .attr('y', yRange[1])
            .attr('height', h);
        this.handleLines
            .attr('y1', yRange[1] + 10)
            .attr('y2', yRange[1] + h - 10);
        // We save the X scale range and set it to the available horizontal space to calculate the selection range in pixels correctly
        const xRange = [0, this._width];
        const xScaleRange = xScale.range();
        xScale.range(xRange);
        const selectionMin = clamp((_b = xScale((_a = (config.selection || this._selection)) === null || _a === void 0 ? void 0 : _a[0])) !== null && _b !== void 0 ? _b : 0, xRange[0], xRange[1]);
        const selectionMax = clamp((_d = xScale((_c = (config.selection || this._selection)) === null || _c === void 0 ? void 0 : _c[1])) !== null && _d !== void 0 ? _d : 0, xRange[0], xRange[1]);
        xScale.range(xScaleRange); // Restore the X scale range
        const selectionLength = selectionMax - selectionMin;
        const brushRange = (selectionLength ? [selectionMin, selectionMax] : xRange);
        this._positionHandles(brushRange);
        smartTransition(this.brush, duration)
            .call(brushBehaviour.move, brushRange) // Sets up the brush and calls brush events
            .on('end interrupt', () => { this._firstRender = false; });
        // We track the first render to not trigger user events on component initialization
        if (!duration)
            this._firstRender = false;
    }
    _updateSelection(s) {
        const xRange = [0, this._width];
        this.unselectedRange
            .attr('x', d => d.type === BrushDirection.West ? xRange[0] : s[1])
            .attr('width', d => {
            const length = d.type === BrushDirection.West ? s[0] - xRange[0] : xRange[1] - s[1];
            const lengthClamped = clamp(length, 0, xRange[1] - xRange[0]);
            return lengthClamped;
        });
        this._positionHandles(s);
        // D3 sets brush handle height to be too long, so we need to update it
        const yRange = [this._height, 0];
        const h = yRange[0] - yRange[1];
        this.g.selectAll('.handle')
            .attr('y', yRange[1])
            .attr('height', h);
    }
    _positionHandles(s) {
        const { config } = this;
        this.brush.selectAll('.handle')
            .attr('width', config.handleWidth)
            .attr('x', d => {
            if (!s)
                return 0;
            const west = d.type === BrushDirection.West;
            const inside = config.handlePosition === Arrangement.Inside;
            if (west)
                return s[0] + (inside ? 0 : -config.handleWidth);
            else
                return s[1] + (inside ? -config.handleWidth : 0);
        });
        this.handleLines
            .attr('transform', d => {
            if (!s)
                return null;
            const west = d.type === BrushDirection.West;
            const inside = config.handlePosition === Arrangement.Inside;
            return `translate(${west
                ? s[0] - Math.pow((-1), Number(inside)) * config.handleWidth / 2
                : s[1] + Math.pow((-1), Number(inside)) * config.handleWidth / 2},0)`;
        });
    }
    _onBrush(event) {
        var _a;
        const { config } = this;
        const xScale = this.xScale;
        const xRange = [0, this._width];
        const s = ((event === null || event === void 0 ? void 0 : event.selection) || xRange);
        const userDriven = !!(event === null || event === void 0 ? void 0 : event.sourceEvent);
        // Handle edge cases:
        // (event?.selection === null) happens when user clicks to reset the selection
        // (s?.[0] === s?.[1]) happens when user drags the selection out of range
        if (userDriven && (((event === null || event === void 0 ? void 0 : event.selection) === null) || // happens when user clicks to reset the selection
            ((s === null || s === void 0 ? void 0 : s[0]) === (s === null || s === void 0 ? void 0 : s[1])) || // happens when user drags the selection out of range
            ((s === null || s === void 0 ? void 0 : s[0]) < xRange[0]) || //
            ((s === null || s === void 0 ? void 0 : s[0]) > xRange[1]) || // happens when you drag the brush and the domain updates
            ((s === null || s === void 0 ? void 0 : s[1]) < xRange[0]) || // to a smaller one and brush goes out of range
            ((s === null || s === void 0 ? void 0 : s[1]) > xRange[1]) //
        )) {
            this.brush.call(this.brushBehaviour.move, xRange); // Will trigger the 'brush end' callback with `range`
            return;
        }
        // When you reset selection by clicking on a non-selected brush area, D3 triggers the brush event twice.
        // The first call will have equal selection coordinates (e.g. [441, 441]), the second call will have the full range (e.g. [0, 700]).
        // To avoid unnecessary render from the first call we skip it
        if (s[0] !== s[1] && isNumber(s[0]) && isNumber(s[1])) {
            // We save the X scale range and set it to the available horizontal space to invert the selection correctly
            const xScaleRange = xScale.range();
            xScale.range(xRange);
            const selectedDomain = s.map(n => +xScale.invert(n));
            if (userDriven) {
                // Constraint the selection if configured
                const xDomain = xScale.domain();
                const xDomainLength = Math.abs(xDomain[1] - xDomain[0]);
                const selectionLength = Math.abs(selectedDomain[1] - selectedDomain[0]);
                if (config.selectionMinLength >= xDomainLength) {
                    console.warn('Unovis | Brush: Configured `selectionMinLength` is bigger than the brush domain');
                }
                if ((selectionLength < config.selectionMinLength) && (config.selectionMinLength < xDomainLength)) {
                    const selection = (_a = config.selection) !== null && _a !== void 0 ? _a : this._selection;
                    const range = [xScale(selection[0]), xScale(selection[1])];
                    this.brush.call(this.brushBehaviour.move, range); // Will trigger the 'brush end' callback with `range`
                    // Restore the X scale range
                    xScale.range(xScaleRange);
                    return;
                }
                else {
                    this._selection = selectedDomain;
                    // Restore the X scale range
                    xScale.range(xScaleRange);
                }
            }
            this._updateSelection(s);
            if (!this._firstRender)
                config.onBrush(selectedDomain, event, userDriven);
        }
    }
    _onBrushStart(event) {
        const { config } = this;
        this._onBrush(event);
        if (!this._firstRender)
            config.onBrushStart(this._selection, event, !!(event === null || event === void 0 ? void 0 : event.sourceEvent));
    }
    _onBrushMove(event) {
        const { config } = this;
        this._onBrush(event);
        if (!this._firstRender)
            config.onBrushMove(this._selection, event, !!(event === null || event === void 0 ? void 0 : event.sourceEvent));
    }
    _onBrushEnd(event) {
        const { config } = this;
        this._onBrush(event);
        if (!this._firstRender)
            config.onBrushEnd(this._selection, event, !!(event === null || event === void 0 ? void 0 : event.sourceEvent));
    }
}
Brush.selectors = style;

export { Brush };
//# sourceMappingURL=index.js.map
