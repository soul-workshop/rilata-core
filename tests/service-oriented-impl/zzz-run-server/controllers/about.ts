import { GeneralServerResolver } from '../../../../src/app/base.index';
import { Controller } from '../../../../src/app/controller/controller';

export class AboutController extends Controller<GeneralServerResolver> {
  async execute(req: Request): Promise<Response> {
    return new Response('another server contoller implement', { status: 200 });
  }

  getUrls(): string[] {
    return ['/about', '/about/'];
  }
}
