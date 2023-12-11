import { injectGlobal, css } from '@emotion/css';

const globalStyles = injectGlobal `
  :root {
    --vis-scatter-cursor: default;
    --vis-scatter-fill-color: var(--vis-color-main);
    --vis-scatter-stroke-color: 'none';
    --vis-scatter-stroke-width: 1px;
    --vis-scatter-fill-opacity: 1;
    --vis-scatter-stroke-opacity: 1;
    --vis-scatter-hover-stroke-width: 2px;

    --vis-scatter-point-label-text-color-dark: #5b5f6d;
    --vis-scatter-point-label-text-color-light: #fff;
    --vis-scatter-point-label-text-font-weight: 500;
    --vis-scatter-point-label-text-font-size: 12px;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-scatter-point-label-text-font-family: */
  }
`;
const root = css `
  label: scatter-component;
`;
const pointGroup = css `
  label: point-group;
`;
const pointGroupExit = css `
  label: point-group-exit;
`;
const point = css `
  label: point;

  > path {
    cursor: var(--vis-scatter-cursor);
    fill: var(--vis-scatter-fill-color);
    fill-opacity: var(--vis-scatter-fill-opacity);
    stroke-opacity: var(--vis-scatter-stroke-opacity);
    stroke-width: var(--vis-scatter-stroke-width);
    stroke: var(--vis-scatter-stroke-color);

    &:hover {
        stroke-width: var(--vis-scatter-hover-stroke-width);
    }
  }

  > text {
    font-weight: var(--vis-scatter-point-label-text-font-weight);
    font-size: var(--vis-scatter-point-label-text-font-size);
    font-family: var(--vis-scatter-point-label-text-font-family, var(--vis-font-family));
    fill: var(--vis-scatter-point-label-text-color-dark);
    user-select: none;
  }
`;

export { globalStyles, point, pointGroup, pointGroupExit, root };
//# sourceMappingURL=style.js.map
