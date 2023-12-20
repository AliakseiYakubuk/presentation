export type ViewBreakpoints = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

class View {
  private viewBreakpoints: ViewBreakpoints = {
    sm: 450,
    md: 600,
    lg: 900,
    xl: 1280,
  };

  protected get breakpoints() {
    return this.viewBreakpoints;
  }

  protected isSmScreen() {
    return document.body.clientWidth <= this.breakpoints.sm;
  }

  protected isMdScreen() {
    return !this.isSmScreen() && (document.body.clientWidth <= this.breakpoints.md);
  }

  protected isLgScreen() {
    return !this.isMdScreen() && (document.body.clientWidth <= this.breakpoints.lg);
  }

  protected isXlScreen() {
    return !this.isLgScreen() && (document.body.clientWidth <= this.breakpoints.xl);
  }

  protected isWidthLessThan(value: number) {
    return document.body.clientWidth < value;
  }
}

export default View;
