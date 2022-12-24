class Page {
  protected id: string;
  protected container: HTMLElement | null;

  constructor(id: string) {
    this.container = document.getElementById('page-container');
    this.id = id;
  }
  protected fillPage(id: string, page: Node) {
    console.log(id, page);
    return page;
  }

  protected makePage(id?: string) {
    const template = document.getElementById(this.id);
    if (template instanceof HTMLTemplateElement && this.container) {
      const newPage = template.content.cloneNode(true);
      if (id) {
        const filledPage = this.fillPage(id, newPage);
        return filledPage;
      }
      return newPage;
    }
    return null;
  }
  draw(id?: string) {
    const page = this.makePage(id);
    if (page && this.container) {
      this.container.innerHTML = '';
      this.container.append(page);
      console.log(this.id);
    }
  }
}

export default Page;
