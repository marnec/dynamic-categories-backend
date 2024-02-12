/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // create the requestContext
    const requestContext = new RequestContext(req, res);
    // get the session via namespace or create a new one
    const session =
      cls.getNamespace(RequestContext.nsid) || cls.createNamespace(RequestContext.nsid);

    // let our new session run with the name of 'RequestContext' and the
    // methods specified in the RequestContext class
    session.run(async () => {
      session.set(RequestContext.name, requestContext);
      next();
    });
  }
}
