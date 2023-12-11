import { Selection } from 'd3-selection';
import { TrimMode, UnovisText, UnovisTextFrameOptions, UnovisTextOptions, UnovisWrappedText } from "../types/text";
/**
 * Converts a kebab-case string to camelCase.
 *
 * @param {string} str - The kebab-case string to be converted.
 * @returns {string} The resulting camelCase string.
 */
export declare function kebabCaseToCamel(str: string): string;
/**
 * Converts a given string to kebab-case.
 * @param {string} str - The input string to be converted to kebab-case.
 * @returns {string} - The kebab-cased string.
 */
export declare function kebabCase(str: string): string;
export declare function escapeStringKeepHash(str: string): string;
/**
 * Trims the input string from the start, leaving only the specified maximum length.
 * @param {string} [str=''] - The input string to be trimmed.
 * @param {number} [maxLength=15] - The maximum allowed length of the trimmed string.
 * @returns {string} - The trimmed string.
 */
export declare function trimStringStart(str?: string, maxLength?: number): string;
/**
 * Trims the input string from the middle, leaving only the specified maximum length.
 * @param {string} [str=''] - The input string to be trimmed.
 * @param {number} [maxLength=15] - The maximum allowed length of the trimmed string.
 * @returns {string} - The trimmed string.
 */
export declare function trimStringMiddle(str?: string, maxLength?: number): string;
/**
 * Trims the input string from the end, leaving only the specified maximum length.
 * @param {string} [str=''] - The input string to be trimmed.
 * @param {number} [maxLength=15] - The maximum allowed length of the trimmed string.
 * @returns {string} - The trimmed string.
 */
export declare function trimStringEnd(str?: string, maxLength?: number): string;
/**
 * Trims the input string according to the specified trim mode.
 * @param {string} [str=''] - The input string to be trimmed.
 * @param {number} [length=15] - The maximum allowed length of the trimmed string.
 * @param {TrimMode} [type=TrimMode.Middle] - The trim mode to be applied.
 * @returns {string} - The trimmed string.
 */
export declare function trimString(str?: string, length?: number, type?: TrimMode): string;
/**
 * Splits the input string according to the specified separators.
 * @param {string} text - The input string to be split.
 * @param {string[]} [separators=[' ']] - The array of separators to be used for splitting.
 * @returns {string[]} - The array of split words.
 */
export declare function splitString(text: string, separators?: string[]): string[];
/**
 * Wraps an SVG text element to fit within the specified width.
 * @param {Selection<SVGTextElement, any, SVGElement, any>} textElement - The SVG text element to be wrapped.
 * @param {number} width - The maximum allowed width for the text element.
 * @param {(string | string[])} [separator=[' ', '-', '.', ',']] - The separator(s) to be used for wrapping.
 */
export declare function wrapSVGText(textElement: Selection<SVGTextElement, any, SVGElement, any>, width: number, separator?: string | string[]): void;
/**
 * Trims an SVG text element based on the specified max width, trim type, and other options.
 * @param {Selection<SVGTextElement, any, SVGElement, any>} svgTextSelection - The D3 selection of the SVG text element to be trimmed.
 * @param {number} [maxWidth=50] - The maximum width of the text element.
 * @param {TrimMode} [trimType=TrimMode.Middle] - The type of trim (start, middle, or end).
 * @param {boolean} [fastMode=true] - Whether to use a fast estimation method for text length calculation.
 * @param {number} [fontSize=0] - The font size of the text.
 * @param {number} [fontWidthToHeightRatio=getFontWidthToHeightRatio()] - The font width to height ratio.
 * @returns {boolean} True if the text was trimmed, false otherwise.
 */
export declare function trimSVGText(svgTextSelection: Selection<SVGTextElement, any, SVGElement, any>, maxWidth?: number, trimType?: TrimMode, fastMode?: boolean, fontSize?: number, fontWidthToHeightRatio?: number): boolean;
/**
 * Estimates the length of a string in pixels.
 * @param {string} str - The string to be measured.
 * @param {number} fontSize - The font size of the string.
 * @param {number} [fontWidthToHeightRatio=getFontWidthToHeightRatio()] - The font width to height ratio.
 * @returns {number} The estimated length of the string in pixels.
 */
export declare function estimateStringPixelLength(str: string, fontSize: number, fontWidthToHeightRatio?: number): number;
/**
 * Calculates the precise length of a string in pixels.
 * @param {string} str - The string to be measured.
 * @param {string} [fontFamily] - The font family of the string.
 * @param {(string | number)} [fontSize] - The font size of the string.
 * @returns {number} The precise length of the string in pixels.
 */
export declare function getPreciseStringLengthPx(str: string, fontFamily?: string, fontSize?: string | number): number;
/**
 * Estimates the dimensions of an SVG text element.
 *
 * @export
 * @param {Selection<SVGTextElement, any, SVGElement, any>} svgTextSelection - The D3 selection of the SVG text element.
 * @param {number} fontSize - The font size.
 * @param {number} [dy=0.32] - The line height scaling factor.
 * @param {boolean} [fastMode=true] - Whether to use a fast estimation method or a more accurate one.
 * @param {number} [fontWidthToHeightRatio] - The font width-to-height ratio.
 * @returns {{width: number, height: number}} - The estimated dimensions of the text element.
 */
export declare function estimateTextSize(svgTextSelection: Selection<SVGTextElement, any, SVGElement, any>, fontSize: number, dy?: number, fastMode?: boolean, fontWidthToHeightRatio?: number): {
    width: number;
    height: number;
};
/**
 * Wraps a text or array of texts to fit within specified width and height, if provided.
 *
 * @export
 * @param {UnovisText | UnovisText[]} text - The text or array of texts to wrap.
 * @param {number | undefined} [width=undefined] - The maximum width of a line in pixels.
 * @param {boolean} [fastMode=true] - Whether to use a fast estimation method or a more accurate one.
 * @param {string | string[]} [separator] - The word separators.
 * @returns {UnovisWrappedText[]} - The wrapped texts.
 */
export declare function getWrappedText(text: UnovisText | UnovisText[], width?: number | undefined, height?: number | undefined, fastMode?: boolean, separator?: string | string[], wordBreak?: boolean): UnovisWrappedText[];
/**
 * Estimates the height of wrapped text blocks.
 *
 * @export
 * @param {UnovisWrappedText[]} blocks - The wrapped text blocks.
 * @returns {number} - The estimated height of the wrapped text blocks.
 */
export declare function estimateWrappedTextHeight(blocks: UnovisWrappedText[]): number;
export declare const allowedSvgTextTags: string[];
/**
 * Renders a text or array of texts to an SVG text element.
 * Calling this function will replace the contents of the specified SVG text element.
 *
 * @export
 * @param {SVGTextElement} textElement - The SVG text element to render the text into.
 * @param {UnovisText | UnovisText[]} text - The text or array of texts to render.
 * @param {UnovisTextOptions} options - The text options.
 */
export declare function renderTextToSvgTextElement(textElement: SVGTextElement, text: UnovisText | UnovisText[], options: UnovisTextOptions): void;
/**
 * Renders a text or array of texts into a frame.
 * Calling this function will replace the contents of the specified SVG group.
 *
 * @export
 * @param {SVGGElement} group - The SVG group element to render the text into.
 * @param {UnovisText | UnovisText[]} text - The text or array of texts to render.
 * @param {UnovisTextFrameOptions} frameOptions - The text frame options.
 */
export declare function renderTextIntoFrame(group: SVGGElement, text: UnovisText | UnovisText[], frameOptions: UnovisTextFrameOptions): void;
