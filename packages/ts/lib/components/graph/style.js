import { injectGlobal, css } from '@emotion/css';
import { UNOVIS_ICON_FONT_FAMILY_DEFAULT } from '../../styles/index.js';
import { label, nodeGauge, node, nodeSelection, nodeSelectionActive } from './modules/node/style.js';
import { gLink, flowCircle } from './modules/link/style.js';

const variables = injectGlobal `
  :root {
    --vis-graph-icon-font-family: ${UNOVIS_ICON_FONT_FAMILY_DEFAULT};
  }
`;
// General
const root = css `
  label: graph-component;
`;
const background = css `
  label: background;
`;
const graphGroup = css `
  label: graph-group;
`;
const zoomOutLevel1 = css `
  label: zoom-out-level-1;

  ${`.${label}`} {
    rect {
      stroke: none;
    }
  }
`;
const zoomOutLevel2 = css `
  label: zoom-out-level-2;

  ${`.${label}`} {
    visibility: visible;
  }

  ${`.${nodeGauge}`} {
    visibility: visible;
  }

  ${`.${node}`} {
    stroke-width: 4px;
  }

  rect${`.${node}`} {
    stroke-width: 2px;
  }

  ${`.${gLink}`} {
    animation: none;
    stroke-dasharray: none;
  }

  ${`.${flowCircle}`} {
    display: none;
  }

  ${`.${nodeSelection}`} {
    &${`.${nodeSelectionActive}`} {
      transform: scale(1.15);
    }
  }
`;

export { background, graphGroup, root, variables, zoomOutLevel1, zoomOutLevel2 };
//# sourceMappingURL=style.js.map
