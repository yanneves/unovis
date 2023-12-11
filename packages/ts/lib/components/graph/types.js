var GraphLayoutType;
(function (GraphLayoutType) {
    GraphLayoutType["Circular"] = "circular";
    GraphLayoutType["Concentric"] = "concentric";
    GraphLayoutType["Parallel"] = "parallel";
    GraphLayoutType["ParallelHorizontal"] = "parallel horizontal";
    GraphLayoutType["Dagre"] = "dagre";
    GraphLayoutType["Force"] = "force";
    GraphLayoutType["Elk"] = "elk";
})(GraphLayoutType || (GraphLayoutType = {}));
var GraphLinkStyle;
(function (GraphLinkStyle) {
    GraphLinkStyle["Dashed"] = "dashed";
    GraphLinkStyle["Solid"] = "solid";
})(GraphLinkStyle || (GraphLinkStyle = {}));
var GraphLinkArrowStyle;
(function (GraphLinkArrowStyle) {
    GraphLinkArrowStyle["Single"] = "single";
    GraphLinkArrowStyle["Double"] = "double";
})(GraphLinkArrowStyle || (GraphLinkArrowStyle = {}));
var GraphNodeShape;
(function (GraphNodeShape) {
    GraphNodeShape["Circle"] = "circle";
    GraphNodeShape["Square"] = "square";
    GraphNodeShape["Hexagon"] = "hexagon";
    GraphNodeShape["Triangle"] = "triangle";
})(GraphNodeShape || (GraphNodeShape = {}));

export { GraphLayoutType, GraphLinkArrowStyle, GraphLinkStyle, GraphNodeShape };
//# sourceMappingURL=types.js.map
