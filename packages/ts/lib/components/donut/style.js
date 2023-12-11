import { css, injectGlobal } from '@emotion/css';

const root = css `
  label: donut-component;
`;
const variables = injectGlobal `
  :root {
    --vis-donut-central-label-font-size: 16px;
    --vis-donut-central-label-text-color: #5b5f6d;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-donut-central-label-font-family: */
    --vis-donut-central-label-font-weight: 600;

    --vis-donut-central-sub-label-font-size: 12px;
    --vis-donut-central-sub-label-text-color: #5b5f6d;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-donut-central-sub-label-font-family: */
    --vis-donut-central-sub-label-font-weight: 500;

    --vis-donut-background-color: #E7E9F3;
    --vis-donut-segment-stroke-width: 0;
    // The line segment color variable is not defined by default
    // to allow it to fallback to the donut background color
    /* --vis-donut-segment-stroke-color: none; */

    --vis-dark-donut-central-label-text-color: #C2BECE;
    --vis-dark-donut-central-sub-label-text-color: #C2BECE;
    --vis-dark-donut-background-color: #18160C;
  }

  body.theme-dark ${`.${root}`} {
    --vis-donut-central-label-text-color: var(--vis-dark-donut-central-label-text-color);
    --vis-donut-central-sub-label-text-color: var(--vis-dark-donut-central-sub-label-text-color);
    --vis-donut-background-color: var(--vis-dark-donut-background-color);
  }
`;
const background = css `
  label: background;
  fill: var(--vis-donut-background-color);
`;
const segment = css `
  label: segment;
  stroke-width: var(--vis-donut-segment-stroke-width);
  stroke: var(--vis-donut-segment-stroke-color, var(--vis-donut-background-color));
`;
const segmentExit = css `
  label: segment-exit;
`;
const centralLabel = css `
  label: central-label;
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: var(--vis-donut-central-label-font-size);
  font-family: var(--vis-donut-central-label-font-family, var(--vis-font-family));
  font-weight: var(--vis-donut-central-label-font-weight);
  fill: var(--vis-donut-central-label-text-color);
`;
const centralSubLabel = css `
  label: central-label;
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: var(--vis-donut-central-sub-label-font-size);
  font-family: var(--vis-donut-central-sub-label-font-family, var(--vis-font-family));
  font-weight: var(--vis-donut-central-sub-label-font-weight);
  fill: var(--vis-donut-central-sub-label-text-color);
`;

export { background, centralLabel, centralSubLabel, root, segment, segmentExit, variables };
//# sourceMappingURL=style.js.map
