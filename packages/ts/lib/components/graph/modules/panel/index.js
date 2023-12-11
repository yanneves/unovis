import { select } from 'd3-selection';
import { trimString } from '../../../../utils/text.js';
import { smartTransition } from '../../../../utils/d3.js';
import { setLabelRect } from '../node/helper.js';
import { getLabelTranslateTransform, OUTLINE_SELECTION_PADDING, DEFAULT_SIDE_LABEL_SIZE } from './helper.js';
import { panelSelection, panel, label, background, labelText, sideIconGroup, sideIconShape, customSideIcon, sideIconSymbol, panelSelectionActive } from './style.js';
import { appendShape, updateShape } from '../shape.js';

function createPanels(selection) {
    selection
        .attr('transform', d => `translate(${d._x}, ${d._y})`)
        .style('opacity', 0);
    selection.append('rect').attr('class', panelSelection)
        .attr('rx', 9)
        .attr('ry', 9)
        .attr('width', d => d._width)
        .attr('height', d => d._height);
    selection.append('rect').attr('class', panel)
        .attr('rx', 7)
        .attr('ry', 7)
        .attr('width', d => d._width)
        .attr('height', d => d._height);
    const panelLabel = selection.append('g').attr('class', label)
        .attr('transform', getLabelTranslateTransform);
    panelLabel.append('rect').attr('class', background);
    panelLabel.append('text').attr('class', labelText)
        .attr('dy', '0.32em');
    const sideIcon = selection.append('g')
        .attr('class', sideIconGroup)
        .attr('transform', (d, i, elements) => {
        const dx = -OUTLINE_SELECTION_PADDING;
        const dy = -OUTLINE_SELECTION_PADDING;
        return `translate(${d._width + dx}, ${-dy})`;
    });
    appendShape(sideIcon, (d) => d.sideIconShape, sideIconShape, customSideIcon);
    sideIcon.append('text').attr('class', sideIconSymbol);
}
function updatePanels(selection, config, duration) {
    smartTransition(selection, duration)
        .attr('transform', d => `translate(${d._x}, ${d._y})`)
        .style('opacity', d => d._disabled ? 0.4 : 1);
    const panels = selection.selectAll(`.${panel}`).data(d => [d]);
    smartTransition(panels, duration)
        .attr('width', d => d._width)
        .attr('height', d => d._height)
        .style('stroke', d => d.borderColor)
        .style('stroke-width', d => d.borderWidth);
    const panelSelection$1 = selection.select(`.${panelSelection}`)
        .classed(panelSelectionActive, d => d.dashedOutline);
    smartTransition(panelSelection$1, duration)
        .attr('x', d => -OUTLINE_SELECTION_PADDING)
        .attr('y', d => -OUTLINE_SELECTION_PADDING)
        .attr('width', d => d._width + OUTLINE_SELECTION_PADDING * 2)
        .attr('height', d => d._height + OUTLINE_SELECTION_PADDING * 2);
    const sideIcon = selection.select(`.${sideIconGroup}`);
    sideIcon.select(`.${sideIconShape}`)
        .call(updateShape, (d) => d.sideIconShape, (d) => { var _a; return (_a = d.sideIconShapeSize) !== null && _a !== void 0 ? _a : DEFAULT_SIDE_LABEL_SIZE; })
        .style('stroke', d => d.sideIconShapeStroke)
        .style('cursor', d => { var _a; return (_a = d.sideIconCursor) !== null && _a !== void 0 ? _a : null; })
        .style('opacity', d => d.sideIconShape ? 1 : 0);
    sideIcon.select(`.${sideIconSymbol}`)
        .html(d => d.sideIconSymbol)
        .attr('dy', 1)
        .style('fill', d => d.sideIconSymbolColor)
        .style('font-size', d => { var _a, _b; return (_a = d.sideIconFontSize) !== null && _a !== void 0 ? _a : (((_b = d.sideIconShapeSize) !== null && _b !== void 0 ? _b : DEFAULT_SIDE_LABEL_SIZE) / 2.5); });
    smartTransition(sideIcon, duration)
        .attr('transform', d => {
        const dx = -OUTLINE_SELECTION_PADDING;
        const dy = -OUTLINE_SELECTION_PADDING;
        return `translate(${d._width + dx}, ${-dy})`;
    });
    const panelLabel = selection.select(`.${label}`);
    panelLabel.select(`.${labelText}`)
        .text(d => trimString(d.label));
    smartTransition(panelLabel, duration)
        .attr('transform', getLabelTranslateTransform);
    panelLabel
        .on('mouseover', (event, d) => {
        const label = select(event.currentTarget);
        const labelContent = d.label;
        label.select('text').text(labelContent);
        setLabelRect(label, labelContent, labelText);
    })
        .on('mouseleave', (event, d) => {
        const label = select(event.currentTarget);
        const labelContent = trimString(d.label);
        label.select('text').text(labelContent);
        setLabelRect(label, labelContent, labelText);
    });
}
function removePanels(selection, config, duration) {
    smartTransition(selection, duration / 2)
        .style('opacity', 0)
        .remove();
}

export { createPanels, removePanels, updatePanels };
//# sourceMappingURL=index.js.map
