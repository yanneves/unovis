import { Selection } from 'd3-selection';
import { ColorAccessor } from "../../../types/accessor";
import { BulletLegendConfigInterface } from '../config';
import { BulletLegendItemInterface } from '../types';
export declare function createBullets(container: Selection<HTMLSpanElement, BulletLegendItemInterface, HTMLDivElement, unknown>, config: BulletLegendConfigInterface): void;
export declare function updateBullets(container: Selection<HTMLSpanElement, BulletLegendItemInterface, HTMLDivElement, unknown>, config: BulletLegendConfigInterface, colorAccessor: ColorAccessor<BulletLegendItemInterface>): void;
