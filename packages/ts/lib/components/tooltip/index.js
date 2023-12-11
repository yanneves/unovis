import { select, pointer } from 'd3-selection';
import { Position } from '../../types/position.js';
import { throttle, merge } from '../../utils/data.js';
import { TooltipDefaultConfig } from './config.js';
import * as style from './style.js';
import { tooltip, hidden, show, positionFixed } from './style.js';

class Tooltip {
    constructor(config = {}) {
        this._defaultConfig = TooltipDefaultConfig;
        this.config = this._defaultConfig;
        this._setUpEventsThrottled = throttle(this._setUpEvents, 500);
        this._setContainerPositionThrottled = throttle(this._setContainerPosition, 500);
        this._isShown = false;
        this.element = document.createElement('div');
        this.div = select(this.element)
            .attr('class', tooltip);
        this.setConfig(config);
        this.components = this.config.components;
    }
    setConfig(config) {
        var _a;
        this.prevConfig = this.config;
        this.config = merge(this._defaultConfig, config);
        if (this.config.container && (this.config.container !== ((_a = this.prevConfig) === null || _a === void 0 ? void 0 : _a.container))) {
            this.setContainer(this.config.container);
        }
        this._setUpAttributes();
    }
    setContainer(container) {
        var _a;
        (_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.element);
        this._container = container;
        this._container.appendChild(this.element);
        this._setContainerPositionThrottled();
    }
    getContainer() {
        return this._container;
    }
    hasContainer() {
        return !!this._container && this._container.isConnected;
    }
    setComponents(components) {
        this.components = components;
    }
    update() {
        if (!this._container)
            return;
        this._setUpEventsThrottled();
    }
    show(html, pos) {
        if (html instanceof HTMLElement) {
            const node = this.div.select(':first-child').node();
            if (node !== html)
                this.div.html('').append(() => html);
        }
        else {
            this.div.html(html);
        }
        this.div
            .classed(hidden, false)
            .classed(show, true);
        this._isShown = true;
        this.place(pos);
    }
    hide() {
        this.div.classed(show, false)
            .on('transitionend', () => {
            // We hide the element once the transition completes
            // This ensures container overflow will not occur when the window is resized
            this.div.classed(hidden, !this._isShown);
        });
        this._isShown = false;
    }
    place(pos) {
        if (!this.hasContainer()) {
            console.warn('Unovis | Tooltip: Container was not set or is not initialized yet');
            return;
        }
        const { config } = this;
        const isContainerBody = this.isContainerBody();
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        const containerHeight = isContainerBody ? window.innerHeight : this._container.scrollHeight;
        const containerWidth = isContainerBody ? window.innerWidth : this._container.scrollWidth;
        const horizontalPlacement = config.horizontalPlacement === Position.Auto
            ? (pos.x > containerWidth / 2 ? Position.Left : Position.Right)
            : config.horizontalPlacement;
        const verticalPlacement = config.verticalPlacement === Position.Auto
            ? (pos.y > containerHeight / 2 ? Position.Top : Position.Bottom)
            : config.verticalPlacement;
        // dx and dy variables shift the tooltip from the default position (above the cursor, centred horizontally)
        const margin = 5;
        const dx = horizontalPlacement === Position.Left ? -width - margin - config.horizontalShift
            : horizontalPlacement === Position.Center ? -width / 2
                : margin + config.horizontalShift;
        const dy = verticalPlacement === Position.Bottom ? height + margin + config.verticalShift
            : verticalPlacement === Position.Center ? height / 2
                : -margin - config.verticalShift;
        // Constraint to container
        const paddingX = 10;
        const hitRight = pos.x > (containerWidth - width - dx - paddingX);
        const hitLeft = pos.x < -dx + paddingX;
        const constraintX = hitRight ? (containerWidth - width - dx) - pos.x - paddingX
            : hitLeft ? -dx - pos.x + paddingX : 0;
        const paddingY = 10;
        const hitBottom = pos.y > (containerHeight - dy - paddingY);
        const hitTop = pos.y < (height - dy + paddingY);
        const constraintY = hitBottom ? containerHeight - dy - pos.y - paddingY
            : hitTop ? height - dy - pos.y + paddingY : 0;
        // Placing
        // If the container size is smaller than the the tooltip size we just stick the tooltip to the top / left
        const x = containerWidth < width ? 0 : pos.x + constraintX + dx;
        const y = containerHeight < height ? height : pos.y + constraintY + dy;
        this.div
            .classed(positionFixed, isContainerBody)
            .style('top', isContainerBody ? `${y - height}px` : 'unset')
            .style('bottom', !isContainerBody ? `${containerHeight - y}px` : 'unset')
            .style('left', `${x}px`);
    }
    isContainerBody() {
        return this._container === document.body;
    }
    _setContainerPosition() {
        var _a;
        // Tooltip position calculation relies on the parent position
        // If it's not set (static), we set it to `relative` (not a good practice)
        if (((_a = getComputedStyle(this._container)) === null || _a === void 0 ? void 0 : _a.position) === 'static') {
            this._container.style.position = 'relative';
        }
    }
    _setUpEvents() {
        const { config: { triggers } } = this;
        const isContainerBody = this.isContainerBody();
        // We use the Event Delegation pattern to set up Tooltip events
        // Every component will have single `mousemove` and `mouseleave` event listener functions, where we'll check
        // the `path` of the event and trigger corresponding callbacks
        this.components.forEach(component => {
            const selection = select(component.element);
            selection
                .on('mousemove.tooltip', (e) => {
                const [x, y] = isContainerBody ? [e.clientX, e.clientY] : pointer(e, this._container);
                const path = (e.composedPath && e.composedPath()) || e.path || [e.target];
                // Go through all of the configured triggers
                for (const className of Object.keys(triggers)) {
                    const template = triggers[className];
                    const els = selection.selectAll(`.${className}`).nodes();
                    // Go through all of the elements in the event path (from the deepest element upwards)
                    for (const el of path) {
                        if (el === selection.node())
                            break; // Break on the component's level (usually the `<g>` element)
                        if (el.classList.contains(className)) { // If there's a match, show the tooltip
                            const i = els.indexOf(el);
                            const d = select(el).datum();
                            const content = template(d, i, els);
                            if (content)
                                this.show(content, { x, y });
                            else
                                this.hide();
                            e.stopPropagation(); // Stop propagation to prevent other interfering events from being triggered, e.g. Crosshair
                            return; // Stop looking for other matches
                        }
                    }
                }
                // Hide the tooltip if the event didn't pass through any of the configured triggers.
                // We use the `this._isShown` condition as a little performance optimization tweak
                // (we don't want the tooltip to update its class on every mouse movement, see `this.hide()`).
                if (this._isShown)
                    this.hide();
            })
                .on('mouseleave.tooltip', (e) => {
                e.stopPropagation(); // Stop propagation to prevent other interfering events from being triggered, e.g. Crosshair
                this.hide();
            });
        });
    }
    _setUpAttributes() {
        const attributesMap = this.config.attributes;
        if (!attributesMap)
            return;
        Object.keys(attributesMap).forEach(attr => {
            this.div.attr(attr, attributesMap[attr]);
        });
    }
    destroy() {
        var _a;
        (_a = this.div) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
Tooltip.selectors = style;

export { Tooltip };
//# sourceMappingURL=index.js.map
