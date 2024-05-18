/* eslint-disable max-len */
import { Serve, Server } from 'bun';
import { AsyncLocalStorage } from 'async_hooks';
import { RilataServer } from './server';
import { Locale } from '../../domain/locale';
import { Controller } from '../controller/controller';
import { ModuleController } from '../controller/module-controller';
import { ResultDTO, RilataRequest } from '../controller/types';
import { Middleware } from '../middleware/middleware';
import { InternalError, NotFoundError } from '../service/error-types';
import { GeneralErrorDod } from '../../domain/domain-data/domain-types';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { GeneralServerResolver } from './types';
import { dodUtility } from '../../common/utils/dod/dod-utility';

export abstract class BunServer extends RilataServer {
  port: number | undefined;

  hostname: string | undefined;

  protected abstract middlewares: Middleware[];

  protected abstract controllers: Controller[];

  protected urls: Record<string, Controller> = {};

  protected server: Server | undefined;

  init(serverResolver: GeneralServerResolver): void {
    super.init(serverResolver);
    this.initStarted();

    this.middlewares.forEach((middleware) => {
      middleware.init(serverResolver);
    });
    this.logger.info('all server middlewares loaded');

    this.modules.forEach((module) => {
      const controller = new ModuleController();
      controller.init(module.getModuleResolver());
      this.controllers.push(controller);
    });

    this.controllers.forEach((controller) => {
      controller.getUrls().forEach((url) => {
        this.urls[url] = controller;
      });
    });
    this.logger.info('all runned module controllers loaded');

    storeDispatcher.setThreadStore(new AsyncLocalStorage());
    this.logger.info('async local store dispatcher setted');
    this.initFinished();
  }

  stop(): void {
    if (this.server !== undefined) this.server.stop();
    this.logger.info(`Http server stopped by address: ${this.hostname}:${this.port}`);
    super.stop();
  }

  run(): void {
    const { port, hostname } = this.resolver.getServerConfig();
    this.port = port;
    this.hostname = hostname;
    this.fetch = this.fetch.bind(this);
    this.server = Bun.serve(this as unknown as Serve<unknown>);
    this.logger.info(`Http server runned by address: ${this.hostname}:${this.port}`);
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    try {
      const middlewaresResult = this.processMiddlewares(req);
      if (middlewaresResult !== undefined) return middlewaresResult;

      const controller = this.urls[url.pathname];
      if (controller) return controller.execute(req);

      return this.getNotFoundError(url);
    } catch (e) {
      if (this.resolver.getRunMode() === 'test') throw e;
      return this.getInternalError(req, e as Error);
    }
  }

  protected processMiddlewares(req: Request): Response | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const middleware of this.middlewares) {
      const response = middleware.process(req as RilataRequest);
      if (response !== undefined) return response;
    }
    return undefined;
  }

  protected getNotFoundError(url: URL): Response {
    const err = dodUtility.getAppError<NotFoundError<Locale<'Not found'>>>(
      'Not found',
      'Запрос по адресу: {{url}} не может быть обработана',
      { url: url.pathname },
    );
    return this.getFailure(err, 404);
  }

  protected getInternalError(req: Request, e: Error): Response {
    this.logger.error(String(e), { url: req.url, body: req.json() }, e as Error);
    const err = dodUtility.getAppError<InternalError<Locale<'Internal error'>>>(
      'Internal error',
      'Внутренняя ошибка сервера',
      {},
    );
    return this.getFailure(err, 500);
  }

  protected getFailure(err: GeneralErrorDod, status: number): Response {
    const resultDto: ResultDTO<GeneralErrorDod, never> = {
      httpStatus: status,
      success: false,
      payload: err,
    };
    return new Response(JSON.stringify(resultDto), { status });
  }
}
