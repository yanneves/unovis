import { BulletLegendItemInterface, BulletShape } from './types';
export interface BulletLegendConfigInterface {
    /** Legend items. Array of `BulletLegendItemInterface`:
     * ```
     * {
     *   name: string | number;
     *   color?: string;
     *   inactive?: boolean;
     *   hidden?: boolean;
     *   pointer?: boolean;
     * }
     * ```
    * Default: `[]` */
    items: BulletLegendItemInterface[];
    /** Apply a specific class to the labels. Default: `''` */
    labelClassName?: string;
    /** Callback function for the legend item click. Default: `undefined` */
    onLegendItemClick?: ((d: BulletLegendItemInterface, i: number) => void);
    /** Label text (<span> element) font-size CSS. Default: `null` */
    labelFontSize?: string | null;
    /** Label text (<span> element) max-width CSS property. Default: `null` */
    labelMaxWidth?: string | null;
    /** Bullet shape size, mapped to the width and height CSS properties. Default: `null` */
    bulletSize?: string | null;
    /** Bullet shape: `BulletShape.Circle`, `BulletShape.Line` or `BulletShape.Square`. Default: `BulletShape.Circle` */
    bulletShape?: BulletShape;
}
export declare const BulletLegendDefaultConfig: BulletLegendConfigInterface;
