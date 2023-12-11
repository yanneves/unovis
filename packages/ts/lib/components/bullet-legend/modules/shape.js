import { getColor } from '../../../utils/color.js';
import { circlePath } from '../../../utils/path.js';
import { PATTERN_SIZE_PX } from '../../../styles/patterns.js';
import { BulletShape } from '../types.js';

// Utils
// Size with respect to the viewBox. We use this to compute path data which is independent of the
// the configured size.
const BULLET_SIZE = PATTERN_SIZE_PX * 3;
function getHeight(shape) {
    switch (shape) {
        case BulletShape.Line:
            return BULLET_SIZE / 2.5;
        default:
            return BULLET_SIZE;
    }
}
function getPath(shape, width, height) {
    switch (shape) {
        case BulletShape.Line:
            return `M0,${height / 2} L${width / 2},${height / 2} L${width},${height / 2}`;
        case BulletShape.Square:
            return `M0,0 L${width},0 L${width},${height} L0,${height}Z`;
        case BulletShape.Circle:
            return circlePath(height / 2, height / 2, height / 2 - 1);
    }
}
function createBullets(container, config) {
    container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .append('path')
        .attr('d', getPath(config.bulletShape, BULLET_SIZE, getHeight(config.bulletShape)));
}
function updateBullets(container, config, colorAccessor) {
    const width = BULLET_SIZE;
    const height = getHeight(config.bulletShape);
    const getOpacity = (d) => d.inactive ? 0.4 : 1;
    const selection = container.select('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .select('path')
        .attr('d', getPath(config.bulletShape, width, height))
        .attr('stroke', (d, i) => getColor(d, colorAccessor, i))
        .style('stroke-width', '1px')
        .style('fill', (d, i) => getColor(d, colorAccessor, i))
        .style('fill-opacity', getOpacity);
    if (config.bulletShape === BulletShape.Line) {
        selection
            .style('stroke-width', `${height / 5}px`)
            .style('opacity', getOpacity)
            .style('fill', null)
            .style('fill-opacity', null)
            .style('marker-start', 'none')
            .style('marker-end', 'none');
    }
}

export { createBullets, updateBullets };
//# sourceMappingURL=shape.js.map
