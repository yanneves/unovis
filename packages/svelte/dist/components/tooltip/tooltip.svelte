<script>// !!! This code was automatically generated. You should not change it !!!
import { Tooltip } from '@unovis/ts';
import { onMount, getContext } from 'svelte';
import { arePropsEqual } from '../../utils/props';
// config
let prevConfig;
let config;
$: config = Object.assign({}, $$restProps);
// component declaration
let component;
const lifecycle = getContext('tooltip');
onMount(() => {
    component = new Tooltip(config);
    return () => component === null || component === void 0 ? void 0 : component.destroy();
});
$: if (!arePropsEqual(prevConfig, config)) {
    component === null || component === void 0 ? void 0 : component.setConfig(config);
    prevConfig = config;
}
// component accessor
export function getComponent() { return component; }
</script>

<vis-tooltip use:lifecycle={component}/>

