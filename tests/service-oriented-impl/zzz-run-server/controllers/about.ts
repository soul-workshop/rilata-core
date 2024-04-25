import { Controller } from '../../../../src/app/controller/controller';

export class AboutController implements Controller {
  async execute(req: Request): Promise<Response> {
    return new Response('bun test implement service');
  }

  getUrls(): string[] {
    return ['/about', '/about/'];
  }
}
