import { select } from 'd3-selection';
import { Sizing } from '../../types/component.js';
import { merge, clamp, isEqual } from '../../utils/data.js';
import { ResizeObserver } from '../../utils/resize-observer.js';
import { ContainerDefaultConfig } from './config.js';

class ContainerCore {
    constructor(element) {
        this._defaultConfig = ContainerDefaultConfig;
        this._isFirstRender = true;
        this._requestedAnimationFrame = null;
        this._container = element;
        // Setting `role` attribute to `image` to make the container accessible
        const container = select(this._container);
        container.attr('role', 'figure');
        // Create SVG element for visualizations
        this.svg = container.append('svg')
            // We set `display` to `block` because inline elements have an invisible
            //   inline space that adds 4px to the height of the container
            .style('display', 'block')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('height', ContainerCore.DEFAULT_CONTAINER_HEIGHT) // Overriding default SVG height of 150
            .attr('aria-hidden', true);
        this._svgDefs = this.svg.append('defs');
        this.element = this.svg.node();
    }
    updateContainer(config) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.prevConfig = this.config;
        this.config = merge(this._defaultConfig, config);
    }
    // The `_preRender` step should be used to perform some actions before rendering.
    // For example, calculating scales, setting component sizes, etc ...
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _preRender() { }
    // The `_render` step should be used to perform the actual rendering
    _render(duration) {
        const { config } = this;
        // Add `svgDefs` if provided in the config
        if (config.svgDefs) {
            this.svg.select('.svgDefs').remove();
            this.svg.append('defs').attr('class', 'svgDefs').html(config.svgDefs);
        }
        // Apply the `aria-label` attribute
        select(this._container)
            .attr('aria-label', config.ariaLabel);
        this._isFirstRender = false;
    }
    // Warning: Some Containers (i.e. Single Container) may override this method, so if you introduce any changes here,
    // make sure to check that other containers didn't break after them.
    render(duration = this.config.duration) {
        const width = this.config.width || this.containerWidth;
        const height = this.config.height || this.containerHeight;
        // We set SVG size in `render()` instead of `_render()`, because the size values in pixels will become
        // available only in the next animation when being accessed via `element.clientWidth` and `element.clientHeight`,
        // and we rely on those values when setting width and size of the components.
        this.svg
            .attr('width', width)
            .attr('height', height);
        // Set up Resize Observer. We do it in `render()` to capture container size change if it happened
        // in the next animation frame after the initial `render` was called.
        if (!this._resizeObserver)
            this._setUpResizeObserver();
        // Schedule the actual rendering in the next frame
        cancelAnimationFrame(this._requestedAnimationFrame);
        this._requestedAnimationFrame = requestAnimationFrame(() => {
            this._preRender();
            this._render(duration);
        });
    }
    get containerWidth() {
        return this.config.width
            ? this.element.clientWidth
            : (this._container.clientWidth || this._container.getBoundingClientRect().width);
    }
    get containerHeight() {
        return this.config.height
            ? this.element.clientHeight
            : (this._container.clientHeight || this._container.getBoundingClientRect().height || ContainerCore.DEFAULT_CONTAINER_HEIGHT);
    }
    get width() {
        return clamp(this.containerWidth - this.config.margin.left - this.config.margin.right, 0, Number.POSITIVE_INFINITY);
    }
    get height() {
        return clamp(this.containerHeight - this.config.margin.top - this.config.margin.bottom, 0, Number.POSITIVE_INFINITY);
    }
    _removeAllChildren() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
    _onResize() {
        const { config } = this;
        const redrawOnResize = config.sizing === Sizing.Fit || config.sizing === Sizing.FitWidth;
        if (redrawOnResize)
            this.render(0);
    }
    _setUpResizeObserver() {
        if (this._resizeObserver)
            return;
        const containerRect = this._container.getBoundingClientRect();
        this._containerSize = { width: containerRect.width, height: containerRect.height };
        this._resizeObserver = new ResizeObserver((entries, observer) => {
            const resizedContainerRect = this._container.getBoundingClientRect();
            const resizedContainerSize = { width: resizedContainerRect.width, height: resizedContainerRect.height };
            const hasSizeChanged = !isEqual(this._containerSize, resizedContainerSize);
            // Do resize only if element is attached to the DOM
            // will come in useful when some ancestor of container becomes detached
            if (hasSizeChanged && resizedContainerSize.width && resizedContainerSize.height) {
                this._containerSize = resizedContainerSize;
                this._onResize();
            }
        });
        this._resizeObserver.observe(this._container);
    }
    destroy() {
        var _a;
        cancelAnimationFrame(this._requestedAnimationFrame);
        (_a = this._resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.svg.remove();
    }
}
// eslint-disable-next-line @typescript-eslint/naming-convention
ContainerCore.DEFAULT_CONTAINER_HEIGHT = 300;

export { ContainerCore };
//# sourceMappingURL=index.js.map
