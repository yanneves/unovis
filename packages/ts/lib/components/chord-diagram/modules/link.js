import { select } from 'd3-selection';
import { ribbon } from 'd3-chord';
import { path } from 'd3-path';
import { areaRadial } from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { Curve } from '../../../types/curve.js';
import { getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';
import { convertLineToArc } from '../../../utils/path.js';

// Generators
function emptyPath() {
    return 'M0,0 L0,0';
}
// Generators
const ribbonGen = ribbon()
    .source(d => d[0])
    .target(d => d[d.length - 1])
    .startAngle(d => d.a0)
    .endAngle(d => d.a1);
const areaGen = areaRadial()
    .curve(Curve.catmullRom.alpha(0.5))
    .startAngle((d, i, points) => i < points.length / 2 ? d.a1 : d.a0)
    .endAngle((d, i, points) => i < points.length / 2 ? d.a0 : d.a1);
// Creates a path from set of points
function linkGen(points, radiusScale) {
    const link = (points.length === 2 ? ribbonGen : areaGen);
    link.radius(d => radiusScale(d.r));
    if (points.length === 2) {
        return link(points);
    }
    const p = path();
    const src = points[0];
    const radius = Math.max(radiusScale(src.r), 0);
    link.context(p);
    link(points);
    p.arc(0, 0, radius, src.a0 - Math.PI / 2, src.a1 - Math.PI / 2, src.a1 - src.a0 <= Number.EPSILON);
    return convertLineToArc(p, radius);
}
function createLink(selection, radiusScale) {
    selection
        .attr('d', d => linkGen(d.points, radiusScale) || emptyPath())
        .style('opacity', 0);
}
function updateLink(selection, config, radiusScale, duration) {
    selection
        .style('transition', `fill-opacity: ${duration}ms`)
        .style('fill', d => getColor(d.data, config.linkColor))
        .style('stroke', d => getColor(d.data, config.linkColor));
    const transition = smartTransition(selection, duration)
        .style('opacity', 1);
    if (duration) {
        transition.attrTween('d', (d, i, el) => {
            const previous = select(el[i]).attr('d');
            const next = linkGen(d.points, radiusScale) || emptyPath();
            return interpolatePath(previous, next);
        });
    }
    else {
        transition.attr('d', d => linkGen(d.points, radiusScale) || emptyPath());
    }
}
function removeLink(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createLink, emptyPath, removeLink, updateLink };
//# sourceMappingURL=link.js.map
