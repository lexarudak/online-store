import Page from './page';

class ErrorPage extends Page {
  constructor() {
    super('error');
    console.log(this.id);
  }
}

export default ErrorPage;
