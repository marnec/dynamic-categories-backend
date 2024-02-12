import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common';
import { camelizeKeys } from 'fast-case';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = Buffer.from(
    (request.headers.authorization as string).split('.')[1],
    'base64url'
  ).toString();

  try {
    return camelizeKeys(JSON.parse(user));
  } catch (error) {
    throw new InternalServerErrorException(
      'could not parse user',
      `user is not a JSON object: ${user}`
    );
  }
});
