import { select } from 'd3-selection';
import { merge } from '../../utils/data.js';
import { BulletLegendDefaultConfig } from './config.js';
import { createBullets, updateBullets } from './modules/shape.js';
import * as style from './style.js';
import { root, item, bullet, label, clickable } from './style.js';

class BulletLegend {
    constructor(element, config) {
        this._defaultConfig = BulletLegendDefaultConfig;
        this.config = this._defaultConfig;
        this._colorAccessor = (d) => d.color;
        this._container = element;
        // Create SVG element for visualizations
        this.div = select(this._container)
            .append('div')
            .attr('class', root);
        this.element = this.div.node();
        if (config)
            this.update(config);
    }
    update(config) {
        this.prevConfig = this.config;
        this.config = merge(this._defaultConfig, config);
        this.render();
    }
    render() {
        const { config } = this;
        const legendItems = this.div.selectAll(`.${item}`)
            .data(config.items);
        const legendItemsEnter = legendItems.enter()
            .append('div')
            .attr('class', item)
            .on('click', this._onItemClick.bind(this));
        legendItemsEnter.append('span')
            .attr('class', bullet)
            .call(createBullets, config);
        legendItemsEnter.append('span')
            .attr('class', label)
            .classed(config.labelClassName, true)
            .style('max-width', config.labelMaxWidth)
            .style('font-size', config.labelFontSize);
        const legendItemsMerged = legendItemsEnter.merge(legendItems);
        legendItemsMerged
            .classed(clickable, d => !!config.onLegendItemClick && this._isItemClickable(d))
            .style('display', (d) => d.hidden ? 'none' : null);
        legendItemsMerged.select(`.${bullet}`)
            .style('min-width', config.bulletSize)
            .style('height', config.bulletSize)
            .call(updateBullets, this.config, this._colorAccessor);
        legendItemsMerged.select(`.${label}`)
            .text((d) => d.name);
        legendItems.exit().remove();
    }
    _isItemClickable(item) {
        return item.pointer === undefined ? true : item.pointer;
    }
    _onItemClick(event, d) {
        const { config: { onLegendItemClick } } = this;
        const legendItems = this.div.selectAll(`.${item}`).nodes();
        const index = legendItems.indexOf(event.currentTarget);
        if (onLegendItemClick)
            onLegendItemClick(d, index);
    }
    destroy() {
        this.div.remove();
    }
}
BulletLegend.selectors = style;

export { BulletLegend };
//# sourceMappingURL=index.js.map
