class Page {
  protected id: string;
  protected container: HTMLElement | null;

  constructor(id: string) {
    this.container = document.getElementById('page-container');
    this.id = id;
  }
  protected makePage() {
    const template = document.getElementById(this.id);
    if (template instanceof HTMLTemplateElement && this.container) {
      const newPage = template.content.cloneNode(true);
      return newPage;
    }
    return null;
  }
  draw() {
    const page = this.makePage();
    if (page && this.container) {
      this.container.innerHTML = '';
      this.container.append(page);
      console.log(page);
    }
  }
}

export default Page;
