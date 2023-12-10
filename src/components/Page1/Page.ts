export type PageOptions = {
  top: string;
  left: string;
};

class Page {
  private positioning: Pick<PageOptions, 'left' | 'top'>;

  constructor({ top, left }: PageOptions) {
    this.positioning = { top, left };
  }

  public get position() {
    return this.positioning;
  }
}

export default Page;
