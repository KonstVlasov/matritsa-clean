import { withParams } from '@krutoo/fetch-tools/url';
import { parseResponse } from '#shared/fetch';
import type {
  CreateMatrixCalcPayload,
  CreateRelationMatrixCalcPayload,
  CreateTaroCalcPayload,
  JwtRefreshPayload,
  MatrixPayload,
  ProfilePayload,
  RelationMatrixPayload,
  ServiceCode,
  SignInPayload,
  SignUpPayload,
  SubscribePayload,
  TaroPayload,
} from './types';

export class Api {
  host: string;

  fetch: typeof fetch;

  constructor({ fetch, host }: { fetch: typeof globalThis.fetch; host: string }) {
    this.fetch = fetch;
    this.host = host;
  }

  withApiHost(pathname: string) {
    const url = new URL(pathname, new Request(this.host).url);

    return url.href;
  }

  private async request(input: string | URL | Request, init: RequestInit) {
    return this.fetch(input, init).then(parseResponse);
  }

  signUp = ({ email, password }: SignUpPayload) => {
    return this.request(this.withApiHost('signup'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  signIn = ({ email, password }: SignInPayload) => {
    return this.request(this.withApiHost('auth/login'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  refreshJwt = ({ refreshToken }: JwtRefreshPayload) => {
    return this.request(this.withApiHost('auth/refresh-token'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
  };

  getUserData = () => {
    return this.request(this.withApiHost('profile'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  updateUserData = (data: ProfilePayload) => {
    return this.request(this.withApiHost('profile'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(data),
    });
  };

  subscribe = ({ email }: SubscribePayload) => {
    return this.request(this.withApiHost('news/subscribe'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
      }),
    });
  };

  getUserCalculations = () => {
    return this.request(this.withApiHost('user/calculations'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getUserCalculation = (calcId: number) => {
    return this.request(this.withApiHost(`user/calculations/${calcId}`), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getUserOrders = () => {
    return this.request(this.withApiHost('user/orders'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getUserItems = ({ targetService }: { targetService?: ServiceCode } = {}) => {
    return this.request(withParams(this.withApiHost('user/items'), { targetService }), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getPreviewMatrix = (payload: MatrixPayload | RelationMatrixPayload) => {
    let actualPayload: MatrixPayload | RelationMatrixPayload;

    if (payload.serviceCode === 'RELATION_MATRIX') {
      actualPayload = {
        name: payload.name,
        name2: payload.name2,
        serviceCode: payload.serviceCode,
        birthDate: payload.birthDate,
        birthDate2: payload.birthDate2,
      };
    } else {
      actualPayload = {
        name: payload.name,
        serviceCode: payload.serviceCode,
        birthDate: payload.birthDate,
      };
    }

    return this.request(this.withApiHost('matrix/preview'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(actualPayload),
    });
  };

  getMatrix = (payload: MatrixPayload | RelationMatrixPayload | { matrixCalcId: number }) => {
    if ('matrixCalcId' in payload) {
      return this.getUserCalculation(payload.matrixCalcId);
    }

    return this.getPreviewMatrix(payload);
  };

  getPreviewTaro = ({ serviceCode, question, pickedCards }: TaroPayload) => {
    return this.request(this.withApiHost('taro/preview'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        serviceCode,
        question,
        pickedCards,
      }),
    });
  };

  getTaro = (payload: TaroPayload | { taroCalcId: number }) => {
    if ('taroCalcId' in payload) {
      return this.getUserCalculation(payload.taroCalcId);
    }

    return this.getPreviewTaro(payload);
  };

  getOffers = () => {
    return this.request(this.withApiHost('offers'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getBlogPosts = () => {
    return this.request(this.withApiHost('blogs'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getBlogPost = ({ postId, postSlug }: { postId?: number | string; postSlug?: string }) => {
    const url = postSlug ? `blogs/slug/${postSlug}` : `blogs/${postId}`;

    return this.request(this.withApiHost(url), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getReviews = () => {
    return this.request(this.withApiHost('reviews'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  getTaroCards = () => {
    return this.request(this.withApiHost('taro/cards'), {
      method: 'GET',
      credentials: 'same-origin',
    });
  };

  checkout = ({ offerId, email }: { offerId: number; email?: string }) => {
    return this.request(this.withApiHost('checkout'), {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        offerId,
        email,
      }),
    });
  };

  createCalcMatrix = (payload: CreateMatrixCalcPayload | CreateRelationMatrixCalcPayload) => {
    let actualPayload: (MatrixPayload | RelationMatrixPayload) & { userItemId: number };

    if (payload.serviceCode === 'RELATION_MATRIX') {
      actualPayload = {
        userItemId: payload.userItemId,
        serviceCode: payload.serviceCode,
        name: payload.name,
        name2: payload.name2,
        birthDate: payload.birthDate,
        birthDate2: payload.birthDate2,
      };
    } else {
      actualPayload = {
        userItemId: payload.userItemId,
        serviceCode: payload.serviceCode,
        name: payload.name,
        birthDate: payload.birthDate,
      };
    }

    return this.request(this.withApiHost('matrix'), {
      method: 'POST',
      body: JSON.stringify(actualPayload),
    });
  };

  createCalcTaro = (payload: CreateTaroCalcPayload) => {
    return this.request(this.withApiHost('taro'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  createCalc = (
    payload: CreateTaroCalcPayload | CreateMatrixCalcPayload | CreateRelationMatrixCalcPayload,
  ) => {
    if (payload.serviceCode === 'TARO_SPREAD') {
      return this.createCalcTaro(payload);
    }

    return this.createCalcMatrix(payload);
  };
}
