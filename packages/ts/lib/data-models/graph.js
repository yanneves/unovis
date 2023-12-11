import { isString, cloneDeep, isFunction, isUndefined, without, isNumber, isObject, isEqual } from '../utils/data.js';
import { CoreDataModel } from './core.js';

class GraphDataModel extends CoreDataModel {
    constructor() {
        super(...arguments);
        this._nodes = [];
        this._links = [];
        this._inputNodesMap = new Map();
        // Model configuration
        this.nodeId = n => (isString(n.id) || isFinite(n.id)) ? `${n.id}` : undefined;
        this.linkId = l => (isString(l.id) || isFinite(l.id)) ? `${l.id}` : undefined;
    }
    get data() {
        return this._data;
    }
    set data(inputData) {
        var _a, _b;
        if (!inputData)
            return;
        this._data = inputData;
        const prevNodes = this.nodes;
        const prevLinks = this.links;
        this._inputNodesMap.clear();
        const nodes = cloneDeep((_a = inputData === null || inputData === void 0 ? void 0 : inputData.nodes) !== null && _a !== void 0 ? _a : []);
        const links = cloneDeep((_b = inputData === null || inputData === void 0 ? void 0 : inputData.links) !== null && _b !== void 0 ? _b : []);
        // Every node or link can have a private state used for rendering needs
        // On data update we transfer state between objects with same ids
        this.transferState(nodes, prevNodes, this.nodeId);
        this.transferState(links, prevLinks, this.linkId);
        // Set node `_id` and `_index`
        nodes.forEach((node, i) => {
            node._index = i;
            node._id = this.nodeId(node) || `${i}`;
            this._inputNodesMap.set(node, inputData.nodes[i]);
        });
        // Sort nodes
        if (isFunction(this.nodeSort))
            nodes.sort(this.nodeSort);
        // Fill link source and target
        links.forEach((link, i) => {
            link._indexGlobal = i;
            link.source = this.findNode(nodes, link.source);
            link.target = this.findNode(nodes, link.target);
        });
        // Set link index for multiple link rendering
        links.forEach((link, i) => {
            if (!isUndefined(link._index) && !isUndefined(link._neighbours))
                return;
            const linksFiltered = links.filter(l => ((link.source === l.source) && (link.target === l.target)) ||
                ((link.source === l.target) && (link.target === l.source)));
            linksFiltered.forEach((l, i) => {
                var _a, _b;
                l._index = i;
                l._id = this.linkId(l) || `${(_a = l.source) === null || _a === void 0 ? void 0 : _a._id}-${(_b = l.target) === null || _b === void 0 ? void 0 : _b._id}-${i}`;
                l._neighbours = linksFiltered.length;
                l._direction = ((link.source === l.source) && (link.target === l.target)) ? 1 : -1;
            });
        });
        nodes.forEach(d => {
            // Determine if a node is connected or not and store it as a property
            d.links = links.filter(l => (l.source === d) || (l.target === d));
            d._isConnected = d.links.length !== 0;
        });
        this._nonConnectedNodes = nodes.filter(d => !d._isConnected);
        this._connectedNodes = without(nodes, ...this._nonConnectedNodes);
        this._nodes = nodes;
        this._links = links.filter(l => l.source && l.target);
    }
    get nodes() {
        return this._nodes;
    }
    get links() {
        return this._links;
    }
    get connectedNodes() {
        return this._connectedNodes;
    }
    get nonConnectedNodes() {
        return this._nonConnectedNodes;
    }
    findNode(nodes, nodeIdentifier) {
        let foundNode;
        if (isNumber(nodeIdentifier))
            foundNode = nodes[nodeIdentifier];
        else if (isString(nodeIdentifier))
            foundNode = nodes.find(node => this.nodeId(node) === nodeIdentifier);
        else if (isObject(nodeIdentifier))
            foundNode = nodes.find(node => isEqual(this._inputNodesMap.get(node), nodeIdentifier));
        if (!foundNode) {
            console.warn(`Node ${nodeIdentifier} is missing from the nodes list`);
        }
        return foundNode;
    }
    transferState(items, itemsPrev, getId) {
        for (const item of items) {
            const dPrev = itemsPrev.find((dp) => getId(dp) === getId(item));
            if (dPrev)
                item._state = Object.assign({}, dPrev._state);
            else
                item._state = {};
        }
    }
}

export { GraphDataModel };
//# sourceMappingURL=graph.js.map
