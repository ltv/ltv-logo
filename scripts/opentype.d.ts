// Minimal types for the parts of opentype.js used by brand-assets.ts.
declare module 'opentype.js' {
  export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  export interface Path {
    toPathData(decimalPlaces?: number): string;
    getBoundingBox(): BoundingBox;
  }
  export interface Glyph {
    index: number;
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }
  export interface Font {
    unitsPerEm: number;
    tables: { os2: { sCapHeight: number } };
    charToGlyph(char: string): Glyph;
    getKerningValue(left: Glyph, right: Glyph): number;
  }
  export function parse(buffer: ArrayBuffer): Font;
}
