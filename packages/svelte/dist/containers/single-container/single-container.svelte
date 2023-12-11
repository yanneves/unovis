<script>import { SingleContainer } from '@unovis/ts';
import { arePropsEqual } from '../../utils/props';
import { onDestroy, setContext } from 'svelte';
// Internal variables
let chart;
let ref;
let component;
let tooltip;
// Props
export let data = undefined;
export let className = '';
/**
 * CSS class string. Requires `:global` modifier to take effect. _i.e._
 * ```css
 * div :global(.chart) { }
 * ```
 * @example
 * <div>
 *     <VisSingleContainer class='chart'>
 *        ...
 *     </VisSingleContainer>
 * </div>
 *
 * @see {@link https://svelte.dev/docs/svelte-components#styles}
*/
export { className as class };
let config;
$: props = $$restProps;
$: config = Object.assign({ component, tooltip }, props);
// Helpers
function initChart() {
    chart = new SingleContainer(ref, config, data);
}
function updateChart(forceUpdate = false) {
    if (forceUpdate)
        chart === null || chart === void 0 ? void 0 : chart.update(config, null, data);
    else if (shouldUpdate)
        chart === null || chart === void 0 ? void 0 : chart.updateContainer(config);
    shouldUpdate = false;
}
// Reactive statements
$: chart === null || chart === void 0 ? void 0 : chart.setData(data);
$: shouldUpdate = Object.keys(props).some(k => !arePropsEqual(chart === null || chart === void 0 ? void 0 : chart.config[k], props[k]));
$: if (shouldUpdate)
    updateChart();
$: if (component)
    chart === undefined ? initChart() : updateChart(true);
// Lifecycle and contexts
setContext('tooltip', () => ({
    update: (t) => { tooltip = t; },
    destroy: () => { tooltip = undefined; },
}));
setContext('component', () => ({
    update: (c) => { component = c; },
    destroy: () => { component = undefined; },
}));
onDestroy(() => chart === null || chart === void 0 ? void 0 : chart.destroy());
</script>

<vis-single-container bind:this={ref} class={`unovis-single-container ${className}`}>
  <slot/>
</vis-single-container>


<style>
  .unovis-single-container {
    display: block;
    position: relative;
    width: 100%;
  }
</style>
