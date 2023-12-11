import { __awaiter } from 'tslib';
import { select } from 'd3-selection';
import { feature } from 'topojson-client';
import { mapboxglWheelEventThrottled, constraintMapView } from '../renderer/mapboxgl-utils.js';
import { mapboxglCanvas, onFeatureHover } from '../style.js';
import { LeafletMapRenderer } from '../types.js';

const initialMapCenter = [36, 14];
const initialMapZoom = 1.9;
function updateTopoJson(maplibreMap, config) {
    var _a, _b;
    const { topoJSONLayer } = config;
    if (topoJSONLayer.sources) {
        const featureObject = (_b = (_a = topoJSONLayer.sources) === null || _a === void 0 ? void 0 : _a.objects) === null || _b === void 0 ? void 0 : _b[topoJSONLayer.featureName];
        if (featureObject) {
            const mapSource = maplibreMap.getSource(topoJSONLayer.featureName);
            const featureCollection = feature(topoJSONLayer.sources, featureObject);
            if (mapSource) {
                mapSource.setData(featureCollection);
            }
            else {
                maplibreMap.addSource(topoJSONLayer.featureName, { type: 'geojson', data: featureCollection });
            }
        }
    }
    const fillLayer = maplibreMap.getLayer(`${topoJSONLayer.featureName}-area`);
    if (topoJSONLayer.fillProperty) {
        if (!fillLayer) {
            maplibreMap.addLayer({
                id: `${topoJSONLayer.featureName}-area`,
                type: 'fill',
                source: topoJSONLayer.featureName,
                paint: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'fill-antialias': false,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'fill-opacity': topoJSONLayer.fillOpacity,
                },
            });
        }
        maplibreMap.setPaintProperty(`${topoJSONLayer.featureName}-area`, 'fill-color', [
            'case',
            ['!', ['has', topoJSONLayer.fillProperty]],
            'rgba(255, 255, 255, 0)',
            ['get', topoJSONLayer.fillProperty],
        ]);
    }
    else if (fillLayer)
        maplibreMap.removeLayer(`${topoJSONLayer.featureName}-area`);
    const strokeLayer = maplibreMap.getLayer(`${topoJSONLayer.featureName}-stroke`);
    if (topoJSONLayer.strokeProperty) {
        if (!strokeLayer) {
            maplibreMap.addLayer({
                id: `${topoJSONLayer.featureName}-stroke`,
                type: 'line',
                source: topoJSONLayer.featureName,
                paint: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'line-opacity': topoJSONLayer.strokeOpacity,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'line-width': topoJSONLayer.strokeWidth,
                },
            });
        }
        maplibreMap.setPaintProperty(`${topoJSONLayer.featureName}-stroke`, 'line-color', [
            'case',
            ['!', ['has', topoJSONLayer.strokeProperty]],
            'rgba(255, 255, 255, 0)',
            ['get', topoJSONLayer.strokeProperty],
        ]);
    }
    else if (strokeLayer) {
        maplibreMap.removeLayer(`${topoJSONLayer.featureName}-stroke`);
    }
}
function setupMap(mapContainer, config) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { style, renderer, topoJSONLayer } = config;
        const leaflet = yield import('leaflet');
        const L = leaflet.default;
        if (!style) {
            console.error('Unovis | Leaflet Map: Please provide style settings in the map configuration object');
            return;
        }
        const leafletMap = L.map(mapContainer, {
            scrollWheelZoom: renderer === LeafletMapRenderer.Raster,
            zoomControl: false,
            zoomDelta: renderer === LeafletMapRenderer.Raster ? 1 : 0.5,
            zoomSnap: renderer === LeafletMapRenderer.Raster ? 1 : 0,
            attributionControl: true,
            center: initialMapCenter,
            zoom: initialMapZoom,
            minZoom: Math.sqrt(mapContainer.offsetWidth) / 17,
            maxZoom: 23,
            maxBounds: L.latLngBounds([-75, -290], [85, 290]),
            maxBoundsViscosity: 1,
        });
        for (const attr of config.attribution) {
            leafletMap.attributionControl.addAttribution(attr);
        }
        let layer;
        let maplibreMap = null;
        switch (renderer) {
            case LeafletMapRenderer.MapLibre:
                // eslint-disable-next-line no-case-declarations
                const maplibre = yield import('maplibre-gl');
                // eslint-disable-next-line no-case-declarations
                const { getMaplibreGLLayer } = yield import('../renderer/mapboxgl-layer.js');
                layer = getMaplibreGLLayer(config, L, maplibre.default);
                maplibreMap = (_b = (_a = layer).getMaplibreMap) === null || _b === void 0 ? void 0 : _b.call(_a);
                select(mapContainer).on('wheel', (event) => {
                    event.preventDefault();
                    mapboxglWheelEventThrottled(leafletMap, layer, event);
                });
                break;
            case LeafletMapRenderer.Raster:
                layer = L.tileLayer(style);
                break;
        }
        layer.addTo(leafletMap);
        // leaflet-mapbox-gl has a layer positioning issue on far zoom levels which leads to having wrong
        //   map points projection. We constrain the view to prevent that.
        constraintMapView(leafletMap);
        if (maplibreMap && (topoJSONLayer === null || topoJSONLayer === void 0 ? void 0 : topoJSONLayer.sources)) {
            const canvas = maplibreMap.getCanvas();
            const canvasSelection = select(canvas).classed(mapboxglCanvas, true);
            const tilePaneSelection = select(leafletMap.getPanes().tilePane);
            maplibreMap.on('mousemove', (event) => {
                const layerName = `${topoJSONLayer.featureName}-area`;
                const layer = maplibreMap.getLayer(layerName);
                if (!layer)
                    return;
                const features = maplibreMap.queryRenderedFeatures(event.point, { layers: [layerName] });
                tilePaneSelection.datum(features[0]);
                canvasSelection.classed(onFeatureHover, Boolean(features[0]));
            });
            maplibreMap.on('load', () => {
                updateTopoJson(maplibreMap, config);
            });
        }
        const svgOverlay = select(leafletMap.getPanes().overlayPane).append('svg');
        const svgGroup = svgOverlay.append('g');
        return {
            leaflet: leafletMap,
            layer,
            svgOverlay,
            svgGroup,
        };
    });
}

export { initialMapCenter, initialMapZoom, setupMap, updateTopoJson };
//# sourceMappingURL=map.js.map
