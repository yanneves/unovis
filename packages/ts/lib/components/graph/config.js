import { ComponentDefaultConfig } from '../../core/component/config.js';
import { TrimMode } from '../../types/text.js';
import { GraphLayoutType, GraphLinkStyle, GraphNodeShape } from './types.js';

// Config
const GraphDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { duration: 1000, zoomScaleExtent: [0.35, 1.25], disableZoom: false, disableDrag: false, zoomThrottledUpdateNodeThreshold: 100, onZoom: undefined, layoutType: GraphLayoutType.Force, layoutAutofit: true, layoutAutofitTolerance: 8.0, layoutNonConnectedAside: false, layoutGroupOrder: [], layoutParallelSubGroupsPerRow: 1, layoutParallelNodesPerColumn: 6, layoutParallelGroupSpacing: undefined, layoutParallelSortConnectionsByGroup: undefined, layoutNodeGroup: (n) => n.group, layoutParallelNodeSubGroup: (n) => n.subgroup, forceLayoutSettings: {
        linkDistance: 60,
        linkStrength: 0.45,
        charge: -500,
        forceXStrength: 0.15,
        forceYStrength: 0.25,
    }, dagreLayoutSettings: {
        rankdir: 'BT',
        ranker: 'longest-path',
    }, layoutElkSettings: undefined, layoutElkNodeGroups: undefined, linkFlowAnimDuration: 20000, linkFlowParticleSize: 2, linkWidth: 1, linkStyle: GraphLinkStyle.Solid, linkBandWidth: 0, linkArrow: undefined, linkStroke: undefined, linkFlow: false, linkLabel: undefined, linkLabelShiftFromCenter: true, linkNeighborSpacing: 8, linkDisabled: false, selectedLinkId: undefined, nodeGaugeAnimDuration: 1500, nodeSize: 30, nodeStrokeWidth: 3, nodeShape: GraphNodeShape.Circle, nodeGaugeValue: 0, nodeIcon: (n) => n.icon, nodeIconSize: undefined, nodeLabel: (n) => n.label, nodeLabelTrim: true, nodeLabelTrimLength: 15, nodeLabelTrimMode: TrimMode.Middle, nodeSubLabel: '', nodeSubLabelTrim: true, nodeSubLabelTrimLength: 15, nodeSubLabelTrimMode: TrimMode.Middle, nodeSideLabels: undefined, nodeBottomIcon: undefined, nodeDisabled: false, nodeFill: (n) => n.fill, nodeGaugeFill: undefined, nodeStroke: (n) => n.stroke, nodeEnterPosition: undefined, nodeEnterScale: 0.75, nodeExitPosition: undefined, nodeExitScale: 0.75, nodeSort: undefined, selectedNodeId: undefined, panels: undefined });

export { GraphDefaultConfig };
//# sourceMappingURL=config.js.map
