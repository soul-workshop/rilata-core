import { GeneralServerResolver } from '../../../../src/app/base.index';
import { Controller } from '../../../../src/app/controller/controller';

export class AboutController implements Controller<GeneralServerResolver> {
  // eslint-disable-next-line
  init(resolver: GeneralServerResolver): void {}

  async execute(req: Request): Promise<Response> {
    return new Response('bun test implement service');
  }

  getUrls(): string[] {
    return ['/about', '/about/'];
  }
}
