import '../../styles/index.js';
import { ContainerCore } from '../../core/container/index.js';
import { smartTransition } from '../../utils/d3.js';
import { Sizing } from '../../types/component.js';
import { SingleContainerDefaultConfig } from './config.js';

// Global CSS variables (side effects import)
class SingleContainer extends ContainerCore {
    constructor(element, config, data) {
        var _a;
        super(element);
        this._defaultConfig = SingleContainerDefaultConfig;
        if (config) {
            this.updateContainer(config, true);
            this.component = config.component;
        }
        if (data) {
            this.setData(data, true);
        }
        // Render if component exists and has data
        if ((_a = this.component) === null || _a === void 0 ? void 0 : _a.datamodel.data)
            this.render();
    }
    setData(data, preventRender) {
        var _a;
        const { config } = this;
        if (this.component)
            this.component.setData(data);
        if (!preventRender)
            this.render();
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.hide();
    }
    updateContainer(containerConfig, preventRender) {
        super.updateContainer(containerConfig);
        this._removeAllChildren();
        this.component = containerConfig.component;
        if (containerConfig.sizing)
            this.component.sizing = containerConfig.sizing;
        this.element.appendChild(this.component.element);
        const tooltip = containerConfig.tooltip;
        if (tooltip) {
            if (!tooltip.hasContainer())
                tooltip.setContainer(this._container);
            tooltip.setComponents([this.component]);
        }
        // Defs
        this.element.appendChild(this._svgDefs.node());
        if (!preventRender)
            this.render();
    }
    updateComponent(componentConfig, preventRender) {
        this.component.setConfig(componentConfig);
        if (!preventRender)
            this.render();
    }
    update(containerConfig, componentConfig, data) {
        if (containerConfig)
            this.updateContainer(containerConfig, true);
        if (componentConfig)
            this.updateComponent(componentConfig, true);
        if (data)
            this.setData(data, true);
        this.render();
    }
    getFitWidthScale() {
        const { config, component } = this;
        const extendedSizeComponent = component;
        if (!extendedSizeComponent.getWidth)
            return 1;
        const componentWidth = extendedSizeComponent.getWidth() + config.margin.left + config.margin.right;
        return this.width / componentWidth;
    }
    _preRender() {
        super._preRender();
        this.component.setSize(this.width, this.height, this.containerWidth, this.containerHeight);
    }
    _render(duration) {
        const { config, component } = this;
        super._render(duration);
        component.g.attr('transform', `translate(${config.margin.left},${config.margin.top})`);
        component.render(duration);
        if (config.tooltip)
            config.tooltip.update();
    }
    // Re-defining the `render()` function to handle different sizing techniques (`Sizing.Extend` and `Sizing.FitWidth`)
    // Not calling `super.render()` because we don't want it to interfere with setting the SVG size here.
    render(duration = this.config.duration) {
        const { config, component } = this;
        if (config.sizing === Sizing.Extend || config.sizing === Sizing.FitWidth) {
            const fitToWidth = config.sizing === Sizing.FitWidth;
            const extendedSizeComponent = component;
            const componentWidth = extendedSizeComponent.getWidth() + config.margin.left + config.margin.right;
            const componentHeight = extendedSizeComponent.getHeight() + config.margin.top + config.margin.bottom;
            const scale = fitToWidth ? this.getFitWidthScale() : 1;
            const currentWidth = this.svg.attr('width');
            const currentHeight = this.svg.attr('height');
            const scaledWidth = componentWidth * scale;
            const scaledHeight = componentHeight * scale;
            const animated = currentWidth || currentHeight;
            smartTransition(this.svg, animated ? duration : 0)
                .attr('width', scaledWidth)
                .attr('height', scaledHeight)
                .attr('viewBox', `${0} ${0} ${componentWidth} ${fitToWidth ? scaledHeight : componentHeight}`)
                .attr('preserveAspectRatio', 'xMinYMin');
        }
        else {
            this.svg
                .attr('width', this.config.width || this.containerWidth)
                .attr('height', this.config.height || this.containerHeight);
        }
        // Set up Resize Observer
        if (!this._resizeObserver)
            this._setUpResizeObserver();
        // Schedule the actual rendering in the next frame
        cancelAnimationFrame(this._requestedAnimationFrame);
        this._requestedAnimationFrame = requestAnimationFrame(() => {
            this._preRender();
            this._render(duration);
        });
    }
    _onResize() {
        var _a;
        const { config } = this;
        super._onResize();
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.hide();
    }
    destroy() {
        var _a;
        const { component, config } = this;
        super.destroy();
        component === null || component === void 0 ? void 0 : component.destroy();
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}

export { SingleContainer };
//# sourceMappingURL=index.js.map
