import { css, injectGlobal } from '@emotion/css';

const nodes = css `
  label: nodes;
`;
const variables = injectGlobal `
  :root {
    /* Node Fill */
    --vis-graph-node-stroke-color: rgb(206, 211, 222);
    --vis-graph-node-fill-color: #fff;
    --vis-graph-node-gauge-color: #adb4c2;
    --vis-graph-node-selection-color: #acb3b8;

    --vis-dark-graph-node-stroke-color: rgba(30,30,30,.25);
    --vis-dark-graph-node-fill-color: #494b56;
    --vis-dark-graph-node-gauge-color: #989aa3;
    --vis-dark-graph-node-selection-color: #494b56;

    /* Node Central Icon */
    --vis-graph-node-icon-fill-color-bright: #ffffff;
    --vis-graph-node-icon-fill-color-dark: var(--vis-color-grey);
    --vis-graph-node-icon-fill-color: #9ea7b8;

    --vis-dark-graph-node-icon-fill-color: var(--vis-graph-node-icon-fill-color-bright);

    /* Node Bottom Icon */
    --vis-graph-node-bottom-icon-font-size: 14pt;
    --vis-graph-node-bottom-icon-fill-color: #a0a6ad;
    --vis-graph-node-bottom-icon-stroke-color: #fff;
    --vis-graph-node-bottom-icon-stroke-width: 2px;

    --vis-dark-graph-node-bottom-icon-fill-color: #a0a6ad;
    --vis-dark-graph-node-bottom-icon-stroke-color: #fff;

    /* Node Label */
    --vis-graph-node-label-font-size: 9pt;
    --vis-graph-node-label-background: #ffffff;
    --vis-graph-node-label-text-color: #0F1E57;
    --vis-graph-node-sublabel-text-color: #989aa3;
    --vis-graph-node-sublabel-font-size: 8pt;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-graph-node-label-font-family: */

    --vis-dark-graph-node-label-background: var(--vis-color-grey);
    --vis-dark-graph-node-label-text-color: #ffffff;
    --vis-dark-graph-node-sublabel-text-color: #989aa3;

    /* Node Side Labels (circular labels)*/
    --vis-graph-node-side-label-background-fill-color: #a0a9af;
    --vis-graph-node-side-label-background-stroke-color: #ffffff;
    --vis-graph-node-side-label-fill-color-bright: #ffffff;
    --vis-graph-node-side-label-fill-color-dark: #494b56;

    --vis-dark-graph-node-side-label-background-fill-color: #989aa3;
    --vis-dark-graph-node-side-label-background-stroke-color: var(--vis-color-grey);
    --vis-dark-graph-node-side-label-fill-color-bright: #f1f4f7;
    --vis-dark-graph-node-side-label-fill-color-dark: var(--vis-color-grey);

    /* Greyout */
    --vis-graph-node-greyout-color: #ebeff7;
    --vis-graph-node-icon-greyout-color: #c6cad1;
    --vis-graph-node-side-label-background-greyout-color: #f1f4f7;

    --vis-dark-graph-node-greyout-color: #494b56;
    --vis-dark-graph-node-icon-greyout-color: var(--vis-color-grey);
    --vis-dark-graph-node-side-label-background-greyout-color: #494B56;
  }

  body.theme-dark ${`.${nodes}`} {
    --vis-graph-node-stroke-color: var(--vis-dark-graph-node-stroke-color);
    --vis-graph-node-fill-color: var(--vis-dark-graph-node-fill-color);
    --vis-graph-node-gauge-color: var(--vis-dark-graph-node-gauge-color);
    --vis-graph-node-selection-color: var(--vis-dark-graph-node-selection-color);

    --vis-graph-node-icon-fill-color: var(--vis-dark-graph-node-icon-fill-color);

    --vis-graph-node-bottom-icon-fill-color: var(--vis-dark-graph-node-bottom-icon-fill-color);
    --vis-graph-node-bottom-icon-stroke-color: var(--vis-dark-graph-node-bottom-icon-stroke-color);

    --vis-graph-node-label-background: var(--vis-dark-graph-node-label-background);
    --vis-graph-node-label-text-color: var(--vis-dark-graph-node-label-text-color);
    --vis-graph-node-sublabel-text-color: var(--vis-dark-graph-node-sublabel-text-color);

    --vis-graph-node-side-label-background-fill-color: var(--vis-dark-graph-node-side-label-background-fill-color);
    --vis-graph-node-side-label-background-stroke-color: var(--vis-dark-graph-side-label-background-stroke-color);
    --vis-graph-node-side-label-fill-color-bright: var(--vis-dark-graph-node-side-label-fill-color-bright);
    --vis-graph-node-side-label-fill-color-dark: var(vis-dark-graph-node-side-label-fill-color-dark);

    --vis-graph-node-greyout-color: var(--vis-dark-graph-node-greyout-color);
    --vis-graph-node-icon-greyout-color: var(--vis-dark-graph-node-icon-greyout-color);
    --vis-graph-node-side-label-background-greyout-color: var(--vis-dark-graph-node-side-label-background-greyout-color);
  }
`;
const node = css `
  label: node-shape;

  stroke: var(--vis-graph-node-stroke-color);
  fill: var(--vis-graph-node-fill-color);
  transition: .4s fill, .4s stroke;
`;
const nodeIcon = css `
  label: icon;

  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  dominant-baseline: middle;
  text-anchor: middle;
  pointer-events: none;
  transition: .4s all;
  fill: var(--vis-graph-node-icon-fill-color);
`;
const nodeBottomIcon = css `
  label: node-bottom-icon;
  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  font-size: var(--vis-graph-node-bottom-icon-font-size);
  dominant-baseline: middle;
  text-anchor: middle;
  pointer-events: none;
  transition: .4s fill;
  fill: var(--vis-graph-node-bottom-icon-fill-color);
  stroke: var(--vis-graph-node-bottom-icon-stroke-color);
  stroke-width: var(--vis-graph-node-bottom-icon-stroke-width);
`;
const nodeIsDragged = css `
  label: dragged;
`;
const label = css `
  label: label;

  text-anchor: middle;
  font-weight: 300;
  font-size: var(--vis-graph-node-label-font-size);
`;
const labelBackground = css `
  label: background;

  opacity: 0.9;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  fill: var(--vis-graph-node-label-background);
`;
const labelText = css `
  label: label-text;
`;
const labelTextContent = css `
  label: label-text-content;

  fill: var(--vis-graph-node-label-text-color);
  font-family: var(--vis-graph-node-label-font-family, var(--vis-font-family));
`;
const subLabelTextContent = css `
  label: sublabel-text-content;

  fill: var(--vis-graph-node-sublabel-text-color);
  font-family: var(--vis-graph-node-label-font-family, var(--vis-font-family));
  font-size: var(--vis-graph-node-sublabel-font-size);
`;
const sideLabelsGroup = css `
  label: side-labels-group;
`;
const sideLabelBackground = css `
  label: side-label-background;

  stroke-opacity: 0.8;
  stroke: var(--vis-graph-node-side-label-background-stroke-color);
  fill: var(--vis-graph-node-side-label-background-fill-color);
`;
const sideLabel = css `
  label: side-label;

  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  dominant-baseline: middle;
  text-anchor: middle;
  font-size: 16px;
  fill: var(--vis-graph-node-side-label-fill-color-bright);
`;
const sideLabelGroup = css `
  label: side-label-group;
  cursor: default;
`;
const gNode = css `
  label: g-node;

  transition: .25s opacity;
`;
const draggable = css `
  label: draggable;

  &:hover {
    cursor: grab;
  }

  &${`.${nodeIsDragged}`} {
    cursor: grabbing;
  }
`;
const gNodeExit = css `
  label: g-node-exit;
  pointer-events: none;
`;
const nodeSelectionActive = css `
  label: active;
`;
const nodeSelection = css `
  label: node-selection;

  fill: none;
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0;
  transition: 350ms cubic-bezier(0.165, 0.840, 0.440, 1.000);
  transform: scale(.5);
  fill: var(--vis-graph-node-selection-color);
  fill-opacity: 0.1;
  stroke: var(--vis-graph-node-selection-color);
  stroke-opacity: 0.75;

  &${`.${nodeSelectionActive}`} {
    opacity: 1;
    transform: scale(1.2);
  }
`;
const nodeGauge = css `
  label: node-gauge;

  fill: var(--vis-graph-node-gauge-color);
  transition: .4s fill;
`;
const nodePolygon = css `
  label: polygon;

  ${`.${nodeGauge}`} {
    fill-opacity: 0;
    stroke-linecap: round;
    pointer-events: none;
  }
`;
const customNode = css `
  label: custom-node;

  stroke-width: 0;
`;
const greyoutNode = css `
  label: greyout;

  ${`.${node}`} {
    fill: var(--vis-graph-node-greyout-color) !important;
    stroke: var(--vis-graph-node-greyout-color) !important;
  }

  ${`.${nodeIcon}`} {
     fill: var(--vis-graph-node-icon-greyout-color) !important;
  }

  ${`.${nodeGauge}`} {
    fill: var(--vis-graph-node-greyout-color) !important;
    stroke: var(--vis-graph-node-greyout-color) !important;
  }

  ${`.${label}`} {
    opacity: 0.5;
  }

  ${`.${sideLabelBackground}`} {
     fill: var(--vis-graph-node-side-label-background-greyout-color) !important;
     stroke-opacity: 0.5;
   }

   ${`.${sideLabel}`} {
    fill: var(--vis-graph-node-side-label-fill-color-bright) !important;
    opacity: 0.25;
  }
`;

export { customNode, draggable, gNode, gNodeExit, greyoutNode, label, labelBackground, labelText, labelTextContent, node, nodeBottomIcon, nodeGauge, nodeIcon, nodeIsDragged, nodePolygon, nodeSelection, nodeSelectionActive, nodes, sideLabel, sideLabelBackground, sideLabelGroup, sideLabelsGroup, subLabelTextContent, variables };
//# sourceMappingURL=style.js.map
