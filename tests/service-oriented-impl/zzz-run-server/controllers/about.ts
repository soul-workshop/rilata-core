import { GeneralServerResolver } from '../../../../src/api/base.index';
import { Controller } from '../../../../src/api/controller/controller';

export class AboutController extends Controller<GeneralServerResolver> {
  async execute(req: Request): Promise<Response> {
    return new Response('another server contoller implement', { status: 200 });
  }

  getUrls(): string[] {
    return ['/about', '/about/'];
  }
}
