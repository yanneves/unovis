import { zoom, zoomIdentity } from 'd3-zoom';
import { timeout } from 'd3-timer';
import { geoPath } from 'd3-geo';
import { color } from 'd3-color';
import { feature } from 'topojson-client';
import { ComponentCore } from '../../core/component/index.js';
import { MapGraphDataModel } from '../../data-models/map-graph.js';
import { isNumber, getString, getNumber, clamp } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor, hexToBrightness } from '../../utils/color.js';
import { isStringCSSVariable, getCSSVariableValue } from '../../utils/misc.js';
import { MapPointLabelPosition } from './types.js';
import { TopoJSONMapDefaultConfig } from './config.js';
import { getLonLat, arc } from './utils.js';
import * as style from './style.js';
import { background, features, links, points, feature as feature$1, link, point, pointCircle, pointLabel } from './style.js';

class TopoJSONMap extends ComponentCore {
    constructor(config, data) {
        super();
        this._defaultConfig = TopoJSONMapDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new MapGraphDataModel();
        this._firstRender = true;
        this._isResizing = false;
        this._initialScale = undefined;
        this._currentZoomLevel = undefined;
        this._path = geoPath();
        this._zoomBehavior = zoom();
        this._backgroundRect = this.g.append('rect').attr('class', background);
        this._featuresGroup = this.g.append('g').attr('class', features);
        this._linksGroup = this.g.append('g').attr('class', links);
        this._pointsGroup = this.g.append('g').attr('class', points);
        this.events = {
            [TopoJSONMap.selectors.point]: {},
            [TopoJSONMap.selectors.feature]: {},
        };
        this._zoomBehavior.on('zoom', this._onZoom.bind(this));
        if (config)
            this.setConfig(config);
        if (data)
            this.setData(data);
        this.g.append('defs')
            .append('filter')
            .attr('id', 'heatmapFilter')
            .html(`
        <feGaussianBlur in="SourceGraphic" stdDeviation="${this.config.heatmapModeBlurStdDeviation}" color-interpolation-filters="sRGB" result="blur"></feGaussianBlur>
        <feColorMatrix class="blurValues" in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -4"></feColorMatrix>
      `);
    }
    setData(data) {
        const { config } = this;
        this.datamodel.pointId = config.pointId;
        this.datamodel.linkSource = config.linkSource;
        this.datamodel.linkTarget = config.linkTarget;
        this.datamodel.data = data;
    }
    setConfig(config) {
        super.setConfig(config);
        const newProjection = this.config.projection;
        if (this._projection) {
            newProjection.scale(this._projection.scale()).translate(this._projection.translate());
        }
        this._projection = newProjection;
    }
    _render(customDuration) {
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        this._renderBackground();
        this._renderMap(duration);
        this._renderGroups(duration);
        this._renderLinks(duration);
        this._renderPoints(duration);
        // When animation is running we need to temporary disable zoom behaviour
        if (duration && !config.disableZoom) {
            this.g.on('.zoom', null);
            timeout(() => {
                this.g.call(this._zoomBehavior);
            }, duration);
        }
        // When zoom behaviour is active we assign the `draggable` class to show the grabbing cursor
        this.g.classed('draggable', !config.disableZoom);
        this._firstRender = false;
    }
    _renderBackground() {
        this._backgroundRect
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('transform', `translate(${-this.bleed.left}, ${-this.bleed.top})`);
    }
    _renderGroups(duration) {
        const transformString = this._transform.toString();
        smartTransition(this._featuresGroup, duration)
            .attr('transform', transformString)
            .attr('stroke-width', 1 / this._currentZoomLevel);
        smartTransition(this._linksGroup, duration)
            .attr('transform', transformString);
        smartTransition(this._pointsGroup, duration)
            .attr('transform', transformString);
    }
    _renderMap(duration) {
        var _a, _b, _c;
        const { bleed, config, datamodel } = this;
        this.g.attr('transform', `translate(${bleed.left}, ${bleed.top})`);
        const mapData = config.topojson;
        const featureName = config.mapFeatureName;
        const featureObject = (_a = mapData === null || mapData === void 0 ? void 0 : mapData.objects) === null || _a === void 0 ? void 0 : _a[featureName];
        if (!featureObject)
            return;
        this._featureCollection = feature(mapData, featureObject);
        const featureData = ((_c = (_b = this._featureCollection) === null || _b === void 0 ? void 0 : _b.features) !== null && _c !== void 0 ? _c : []);
        if (this._firstRender) {
            // Rendering the map for the first time.
            this._projection.fitExtent([[0, 0], [this._width, this._height]], this._featureCollection);
            this._initialScale = this._projection.scale();
            this._center = this._projection.translate();
            if (config.mapFitToPoints) {
                this._fitToPoints();
            }
            const zoomExtent = config.zoomExtent;
            this._zoomBehavior.scaleExtent([zoomExtent[0] * this._initialScale, zoomExtent[1] * this._initialScale]);
            this.setZoom(config.zoomFactor || 1);
            if (!config.disableZoom) {
                this.g.call(this._zoomBehavior);
                this._applyZoom();
            }
            this._prevWidth = this._width;
            this._prevHeight = this._height;
        }
        if (this._prevWidth !== this._width || this._prevHeight !== this._height) {
            this._onResize();
        }
        this._path.projection(this._projection);
        // Merge passed area data and map feature data
        const areaData = datamodel.areas;
        areaData.forEach(a => {
            const feature = featureData.find(f => f.id.toString() === getString(a, config.areaId).toString());
            if (feature)
                feature.data = a;
            else if (this._firstRender)
                console.warn(`Can't find feature by area code ${getString(a, config.areaId)}`);
        });
        const features = this._featuresGroup
            .selectAll(`.${feature$1}`)
            .data(featureData);
        const featuresEnter = features.enter().append('path').attr('class', feature$1);
        smartTransition(featuresEnter.merge(features), duration)
            .attr('d', this._path)
            .style('fill', (d, i) => d.data ? getColor(d.data, config.areaColor, i) : null)
            .style('cursor', d => d.data ? getString(d.data, config.areaCursor) : null);
        features.exit().remove();
    }
    _renderLinks(duration) {
        const { config, datamodel } = this;
        const links = datamodel.links;
        const edges = this._linksGroup
            .selectAll(`.${link}`)
            .data(links, (d, i) => getString(d, config.linkId, i));
        const edgesEnter = edges.enter().append('path').attr('class', link)
            .style('stroke-width', 0);
        smartTransition(edgesEnter.merge(edges), duration)
            .attr('d', link => {
            const source = this._projection(getLonLat(link.source, config.longitude, config.latitude));
            const target = this._projection(getLonLat(link.target, config.longitude, config.latitude));
            return arc(source, target);
        })
            .style('stroke-width', link => getNumber(link, config.linkWidth) / this._currentZoomLevel)
            .style('cursor', link => getString(link, config.linkCursor))
            .style('stroke', (link, i) => getColor(link, config.linkColor, i));
        edges.exit().remove();
    }
    _renderPoints(duration) {
        const { config, datamodel } = this;
        const pointData = datamodel.points;
        const points = this._pointsGroup
            .selectAll(`.${point}`)
            .data(pointData, (d, i) => getString(d, config.pointId, i));
        // Enter
        const pointsEnter = points.enter().append('g').attr('class', point)
            .attr('transform', d => {
            const pos = this._projection(getLonLat(d, config.longitude, config.latitude));
            return `translate(${pos[0]},${pos[1]})`;
        });
        pointsEnter.append('circle').attr('class', pointCircle)
            .attr('r', 0)
            .style('fill', (d, i) => getColor(d, config.pointColor, i))
            .style('stroke-width', d => getNumber(d, config.pointStrokeWidth));
        pointsEnter.append('text').attr('class', pointLabel)
            .style('opacity', 0);
        // Update
        const pointsMerged = pointsEnter.merge(points);
        smartTransition(pointsMerged, duration)
            .attr('transform', d => {
            const pos = this._projection(getLonLat(d, config.longitude, config.latitude));
            return `translate(${pos[0]},${pos[1]})`;
        })
            .style('cursor', d => getString(d, config.pointCursor));
        smartTransition(pointsMerged.select(`.${pointCircle}`), duration)
            .attr('r', d => getNumber(d, config.pointRadius) / this._currentZoomLevel)
            .style('fill', (d, i) => getColor(d, config.pointColor, i))
            .style('stroke', (d, i) => getColor(d, config.pointColor, i))
            .style('stroke-width', d => getNumber(d, config.pointStrokeWidth) / this._currentZoomLevel);
        const pointLabelsMerged = pointsMerged.select(`.${pointLabel}`);
        pointLabelsMerged
            .text(d => { var _a; return (_a = getString(d, config.pointLabel)) !== null && _a !== void 0 ? _a : ''; })
            .style('font-size', d => {
            if (config.pointLabelPosition === MapPointLabelPosition.Bottom) {
                return `calc(var(--vis-map-point-label-font-size) / ${this._currentZoomLevel}`;
            }
            const pointDiameter = 2 * getNumber(d, config.pointRadius);
            const pointLabelText = getString(d, config.pointLabel) || '';
            const textLength = pointLabelText.length;
            const fontSize = 0.5 * pointDiameter / Math.pow(textLength, 0.4);
            return clamp(fontSize, fontSize, 16);
        })
            .attr('y', d => {
            if (config.pointLabelPosition === MapPointLabelPosition.Center)
                return null;
            const pointRadius = getNumber(d, config.pointRadius) / this._currentZoomLevel;
            return pointRadius;
        })
            .attr('dy', config.pointLabelPosition === MapPointLabelPosition.Center ? '0.32em' : '1em');
        smartTransition(pointLabelsMerged, duration)
            .style('fill', (d, i) => {
            var _a;
            if (config.pointLabelPosition === MapPointLabelPosition.Bottom)
                return null;
            const pointColor = getColor(d, config.pointColor, i);
            const hex = (_a = color(isStringCSSVariable(pointColor) ? getCSSVariableValue(pointColor, this.element) : pointColor)) === null || _a === void 0 ? void 0 : _a.hex();
            if (!hex)
                return null;
            const brightness = hexToBrightness(hex);
            return brightness > config.pointLabelTextBrightnessRatio ? 'var(--vis-map-point-label-text-color-dark)' : 'var(--vis-map-point-label-text-color-light)';
        })
            .style('opacity', 1);
        // Exit
        points.exit().remove();
        // Heatmap
        this._pointsGroup.style('filter', (config.heatmapMode && this._currentZoomLevel < config.heatmapModeZoomLevelThreshold) ? 'url(#heatmapFilter)' : null);
        this._pointsGroup.selectAll(`.${pointLabel}`).style('display', (config.heatmapMode && (this._currentZoomLevel < config.heatmapModeZoomLevelThreshold)) ? 'none' : null);
    }
    _fitToPoints(points, pad = 0.1) {
        const { config, datamodel } = this;
        const pointData = points || datamodel.points;
        if (pointData.length === 0)
            return;
        const featureCollection = {
            type: 'FeatureCollection',
            features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'MultiPoint',
                        coordinates: pointData.map(p => {
                            return [
                                getNumber(p, d => getNumber(d, config.longitude)),
                                getNumber(p, d => getNumber(d, config.latitude)),
                            ];
                        }),
                    },
                }],
        };
        this._projection.fitExtent([
            [this._width * pad, this._height * pad],
            [this._width * (1 - pad), this._height * (1 - pad)],
        ], featureCollection);
        const maxScale = config.zoomExtent[1] * this._initialScale;
        if (this._projection.scale() > maxScale)
            this._projection.scale(maxScale);
        this._applyZoom();
    }
    _applyZoom() {
        var _a;
        const translate = (_a = this._center) !== null && _a !== void 0 ? _a : this._projection.translate();
        const scale = this._initialScale * this._currentZoomLevel;
        this.g.call(this._zoomBehavior.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }
    _onResize() {
        this._isResizing = true;
        const prevTranslate = this._projection.translate();
        this._projection.fitExtent([[0, 0], [this._width, this._height]], this._featureCollection);
        this._initialScale = this._projection.scale();
        this._center = [
            this._projection.translate()[0] * this._center[0] / prevTranslate[0],
            this._projection.translate()[1] * this._center[1] / prevTranslate[1],
        ];
        this._applyZoom();
        this._isResizing = false;
        this._prevWidth = this._width;
        this._prevHeight = this._height;
    }
    _onZoom(event) {
        if (this._firstRender)
            return; // To prevent double render because of binding zoom behaviour
        const isMouseEvent = event.sourceEvent !== undefined;
        const isExternalEvent = !(event === null || event === void 0 ? void 0 : event.sourceEvent) && !this._isResizing;
        window.cancelAnimationFrame(this._animFrameId);
        this._animFrameId = window.requestAnimationFrame(this._onZoomHandler.bind(this, event.transform, isMouseEvent, isExternalEvent));
        if (isMouseEvent) {
            // Update the center coordinate so that the next call to _applyZoom()
            // will zoom with respect to the current view
            this._center = [event.transform.x, event.transform.y];
        }
        this._currentZoomLevel = ((event === null || event === void 0 ? void 0 : event.transform.k) / this._initialScale) || 1;
    }
    _onZoomHandler(transform, isMouseEvent, isExternalEvent) {
        const scale = transform.k / this._initialScale || 1;
        const center = this._projection.translate();
        this._transform = zoomIdentity
            .translate(transform.x - center[0] * scale, transform.y - center[1] * scale)
            .scale(scale);
        const customDuration = isExternalEvent
            ? this.config.zoomDuration
            : (isMouseEvent ? 0 : null);
        // Call render functions that depend on this._transform
        this._renderGroups(customDuration);
        this._renderLinks(customDuration);
        this._renderPoints(customDuration);
    }
    zoomIn(increment = 0.5) {
        this.setZoom(this._currentZoomLevel + increment);
    }
    zoomOut(increment = 0.5) {
        this.setZoom(this._currentZoomLevel - increment);
    }
    setZoom(zoomLevel) {
        const { config } = this;
        this._currentZoomLevel = clamp(zoomLevel, config.zoomExtent[0], config.zoomExtent[1]);
        this._transform = zoomIdentity
            .translate(this._center[0] * (1 - this._currentZoomLevel), this._center[1] * (1 - this._currentZoomLevel))
            .scale(this._currentZoomLevel);
        // We are using this._applyZoom() instead of directly calling this._render(config.zoomDuration) because
        // we've to "attach" new transform to the map group element. Otherwise zoomBehavior  will not know
        // that the zoom state has changed
        this._applyZoom();
    }
    fitView() {
        var _a;
        this._projection.fitExtent([[0, 0], [this._width, this._height]], this._featureCollection);
        this._currentZoomLevel = (((_a = this._projection) === null || _a === void 0 ? void 0 : _a.scale()) / this._initialScale) || 1;
        this._center = this._projection.translate();
        // We are using this._applyZoom() instead of directly calling this._render(config.zoomDuration) because
        // we've to "attach" new transform to the map group element. Otherwise zoomBehavior  will not know
        // that the zoom state has changed
        this._applyZoom();
    }
    destroy() {
        window.cancelAnimationFrame(this._animFrameId);
    }
}
TopoJSONMap.selectors = style;

export { TopoJSONMap };
//# sourceMappingURL=index.js.map
