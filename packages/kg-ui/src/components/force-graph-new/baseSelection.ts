import d3 from "d3";
type S<T extends d3.BaseType = d3.BaseType> = d3.Selection<T, any, any, any>;
type Svg = S<SVGSVGElement>;

export class BaseSelection {
  protected svg?: Svg;
  private _marker?: Svg;
  private _link?: S;
  private _node?: S;
  private _linkText?: S;
  private _nodeText?: S;

  get marker(): Svg | undefined {
    if (this.svg) {
      if (this._marker) return this.marker;
    }
    return undefined;
  }

  get link(): S | undefined {
    if (this.svg) {
      if (this._link) return this.link;
    }
    return undefined;
  }

  get linkText(): S | undefined {
    if (this.svg) {
      if (this._linkText) return this._linkText;
    }
    return undefined;
  }

  get node(): S | undefined {
    if (this.svg) {
      if (this._node) return this._node;
    }
    return undefined;
  }

  get nodeText(): S | undefined {
    if (this.svg) {
      if (this._nodeText) return this._nodeText;
    }
    return undefined;
  }
}
