import { injectGlobal, css } from '@emotion/css';

const globalStyles = injectGlobal `
  :root {
    --vis-crosshair-line-stroke-color: #888;
    --vis-crosshair-line-stroke-width: 1px;
    --vis-crosshair-circle-stroke-color: #fff;
    --vis-crosshair-circle-stroke-width: 1px;
  }
`;
const root = css `
  label: crosshair-component;
`;
const line = css `
  stroke: var(--vis-crosshair-line-stroke-color);
  stroke-width: var(--vis-crosshair-line-stroke-width);
  stroke-opacity: 1;
  pointer-events: none;
`;
const circle = css `
  stroke: var(--vis-crosshair-circle-stroke-color);
  stroke-width: var(--vis-crosshair-circle-stroke-width);
  stroke-opacity: 0.75;
  pointer-events: none;
`;

export { circle, globalStyles, line, root };
//# sourceMappingURL=style.js.map
