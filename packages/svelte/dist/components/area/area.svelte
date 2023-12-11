<script>// !!! This code was automatically generated. You should not change it !!!
import { Area } from '@unovis/ts';
import { onMount, getContext } from 'svelte';
import { arePropsEqual } from '../../utils/props';
// data and required props
// eslint-disable-next-line no-undef-init
export let data = undefined;
export let x;
export let y;
// config
let prevConfig;
let config;
$: config = Object.assign({ x, y }, $$restProps);
// component declaration
let component;
const lifecycle = getContext('component');
onMount(() => {
    component = new Area(config);
    return () => component === null || component === void 0 ? void 0 : component.destroy();
});
$: component === null || component === void 0 ? void 0 : component.setData(data);
$: if (!arePropsEqual(prevConfig, config)) {
    component === null || component === void 0 ? void 0 : component.setConfig(config);
    prevConfig = config;
}
// component accessor
export function getComponent() { return component; }
</script>

<vis-component use:lifecycle={component}/>

