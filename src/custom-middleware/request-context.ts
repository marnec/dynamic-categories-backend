import { HttpException, HttpStatus } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { IncomingMessage } from 'http';


export class RequestContext {
  public static nsid = 'some_random_guid';

  public readonly id: number;

  public request: IncomingMessage;

  public response: Response;

  constructor(request: IncomingMessage, response: Response) {
    this.id = Math.random();
    this.request = request;
    this.response = response;
  }

  public static currentRequestContext(): RequestContext {
    const session = cls.getNamespace(RequestContext.nsid);
    if (session && session.active) {
      return session.get(RequestContext.name);
    }

    return null;
  }

  public static currentRequest(): IncomingMessage {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.request;
    }

    return null;
  }

  public static currentResponse(): Response {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.response;
    }
    return null;
  }

  public static currentUser(throwError?: boolean) {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      // eslint-disable-next-line dot-notation
      const user: any = requestContext.request['user'];
      if (user) {
        return user.user;
      }
    }

    if (throwError) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return null;
  }
}
