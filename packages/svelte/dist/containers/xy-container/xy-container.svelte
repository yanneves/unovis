<script>import { XYContainer } from '@unovis/ts';
import { onMount, setContext } from 'svelte';
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
 *     <VisXYContainer class='chart'>
 *        ...
 *     <VisXYContainer>
 * </div>
 *
 * @see {@link https://svelte.dev/docs/svelte-components#styles}
*/
export { className as class };
let chart;
const config = {
    components: [],
    crosshair: undefined,
    tooltip: undefined,
    xAxis: undefined,
    yAxis: undefined,
};
let ref;
$: chart === null || chart === void 0 ? void 0 : chart.setData(data, true);
$: chart === null || chart === void 0 ? void 0 : chart.updateContainer(Object.assign(Object.assign({}, config), $$restProps));
onMount(() => {
    chart = new XYContainer(ref, config, data);
    return () => chart.destroy();
});
setContext('component', () => ({
    update: (c) => { config.components = [...config.components, c]; },
    destroy: () => { config.components = config.components.filter(c => !c.isDestroyed()); },
}));
setContext('axis', (e) => ({
    update: (c) => {
        e.__type__ = c.config.type;
        config[`${e.__type__}Axis`] = c;
    },
    destroy: () => { config[`${e.__type__}Axis`] = undefined; },
}));
setContext('crosshair', () => ({
    update: (c) => { config.crosshair = c; },
    destroy: () => { config.crosshair = undefined; },
}));
setContext('tooltip', () => ({
    update: (t) => { config.tooltip = t; },
    destroy: () => { config.tooltip = undefined; },
}));
</script>

<vis-xy-container bind:this={ref} class={`unovis-xy-container ${className}`}>
  <slot />
</vis-xy-container>


<style>
  .unovis-xy-container {
    display: block;
    position: relative;
    width: 100%;
  }
</style>
