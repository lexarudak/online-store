class Page {
  protected id: string;
  protected container: HTMLElement | null;

  constructor(id: string) {
    this.container = document.getElementById('page-container');
    this.id = id;
  }
  protected fillPage(info: object, page: Node) {
    console.log(info, page);
    // if (info === {}) {
    //   return page;
    // }
    return page;
  }

  protected makePage(info = {}) {
    const template = document.getElementById(this.id);
    if (template instanceof HTMLTemplateElement && this.container) {
      const newPage = template.content.cloneNode(true);
      const filledPage = this.fillPage(info, newPage);
      return filledPage;
    }
    return null;
  }
  draw(info = {}) {
    const page = this.makePage(info);
    if (page && this.container) {
      this.container.innerHTML = '';
      this.container.append(page);
      console.log(this.id);
    }
  }
}

export default Page;
