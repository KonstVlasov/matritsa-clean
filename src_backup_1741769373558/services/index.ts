import { applyMiddleware, configureFetch } from '@krutoo/fetch-tools';
import { type JwtMiddlewareOptions, defaultHeaders, jwt } from '@krutoo/fetch-tools/middleware';
import { wait } from '@krutoo/utils';
import { Api } from '#shared/api';

export interface Deps {
  fetch: typeof fetch;
  api: Api;
}

export function provideFetch({
  jwtToken,
  onUnauthorized,
}: {
  jwtToken: JwtMiddlewareOptions['token'];
  onUnauthorized: VoidFunction;
}) {
  return configureFetch(
    fetch,
    applyMiddleware(
      // формируем минимальную длительность запроса в 200мс
      async (request, next) => {
        const [response] = await Promise.all([next(request), wait(200)]);
        return response;
      },

      defaultHeaders(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        {
          strategy: 'set',
        },
      ),

      jwt({
        token: jwtToken,
        filter: req =>
          req.url.startsWith(import.meta.env.API_HOST) ||
          req.url.startsWith(window.location.origin + '/api'),
      }),

      // реагируем если получили 401
      async (request, next) => {
        const response = await next(request);

        if (response.status === 401) {
          onUnauthorized?.();
        }

        return response;
      },
    ),
  );
}
