class Page {
  private htmlClass: string;

  constructor(htmlClass: string) {
    this.htmlClass = htmlClass;
  }

  public getClass() {
    return this.htmlClass;
  }
}

export default Page;
