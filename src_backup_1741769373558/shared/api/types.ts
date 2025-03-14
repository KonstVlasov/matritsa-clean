export interface SignUpPayload {
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface JwtRefreshPayload {
  refreshToken: string;
}

export interface SubscribePayload {
  email: string;
}

export interface ProfilePayload {
  phone: string;
  name: string;
  sex: string;
  birthDate: string;
  partnerName: string;
  partnerBirthDate: string;
}

export interface MatrixPayload {
  serviceCode: Exclude<MatrixType, 'RELATION_MATRIX'>;
  birthDate: string;
  name: string;
}

export interface RelationMatrixPayload {
  serviceCode: Extract<MatrixType, 'RELATION_MATRIX'>;
  name: string;
  name2: string;
  birthDate: string;
  birthDate2: string;
}

export interface TaroPayload {
  serviceCode: TaroType;
  question: string;
  pickedCards: number[];
}

/** Профиль */
export interface Profile {
  id: number;
  email: string;
  phone: string | null;
  name: string | null;
  sex: 'male' | 'female' | null;
  birthDate: string | null;
  partnerName: string | null;
  partnerBirthDate: string | null;
}

/** Карта Таро */
export interface TaroCard {
  index: number;
  name: string;
  description: string;
}

/** Расклад Таро */
export interface TaroResult extends TaroPayload {
  serviceCode: TaroType;
  cards: TaroCard[];
  answer?: string;
}

/** Предложение (то, что можно купить) */
export interface Offer {
  id: number;
  name: string;
  cost: number;
  props: string[];
  is_popular: boolean;
}

export type MatrixValueKey =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'O'
  | 'S'
  | 'J'
  | 'K'
  | 'L'
  | 'N'
  | 'M'
  | 'P'
  | 'Q'
  | 'R'
  | 'T'
  | 'V'
  | 'U'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

/** Тип матрицы */
export type MatrixType =
  | 'PERSONAL_MATRIX'
  | 'FINANCE_MATRIX'
  | 'CHILDREN_MATRIX'
  | 'RELATION_MATRIX';

/** Тип таро */
export type TaroType = 'TARO_SPREAD';

/** Тип услуги */
export type ServiceCode = MatrixType | TaroType;

/** Тип товара */
export type ProductCode =
  | 'PRODUCT_TARO_UNIVERSAL'
  | 'PRODUCT_MATRIX_PERSONAL'
  | 'PRODUCT_MATRIX_COMPATIBILITY'
  | 'PRODUCT_MATRIX_FINANCE'
  | 'PRODUCT_MATRIX_CHILDREN'
  | 'PRODUCT_MATRIX_UNIVERSAL';

export interface MatrixPurpose {
  PURPOSE: {
    SEARCH: {
      SKY: number;
      EARTH: number;
      SUM: number;
    };
    SOCIALIZATION: {
      MEN: number;
      WOMEN: number;
      SUM: number;
    };
    SPIRIT: number;
    PLANETARY: number;
  };
}

/** Расчет матрицы (персональная/финансы/детская)  */
export interface MatrixResult extends MatrixPayload {
  calc: Record<MatrixValueKey, number | undefined> & MatrixPurpose;
  table: Array<{
    name: string;
    physic: number;
    energy: number;
    emotions: number;
  }>;
  transcriptions: Array<{ title: string; is_blocked: boolean; content: null | string[] }>;
}

/** Расчет матрицы совместимости */
export interface RelationMatrixResult extends RelationMatrixPayload {
  calc: Record<MatrixValueKey, number | undefined> & MatrixPurpose;
  matrixPartner1: Record<string, number | undefined>;
  matrixPartner2: Record<string, number | undefined>;
  transcriptions: Array<{ title: string; is_blocked: boolean; content: null | string[] }>;
}

/** Расчет */
export interface CalculationBase {
  id: number;
}

export interface CalculationMatrix extends CalculationBase, MatrixResult {}
export interface CalculationRelationMatrix extends CalculationBase, RelationMatrixResult {}
export interface CalculationTaro extends CalculationBase, TaroResult {}

export type Calculation = CalculationTaro | CalculationMatrix | CalculationRelationMatrix;

/** Заказ */
export interface Order {
  id: number;
  createdAt: string;
  offerName: string;
  amount: number;
}

/** Сущность в инвентаре пользователя */
export interface Item {
  id: number;
  productCode: ProductCode;
  useTime: number;
  amount: number;
  endDate: string | null;
  isSubscription: boolean;
}

/** Запись в блоге */
export interface BlogPost {
  id: number;
  title: string;
  image: string;
  author: string;
  editor: string;
  text: string;
  excerpt: string;
  slug?: string;
  seo_title?: string | null;
  seo_keywords?: string | null;
  seo_description?: string | null;
}

/** Отзыв */
export interface Review {
  id: number;
  stars: number;
  content: string;
  author: string;
}

export interface CreateMatrixCalcPayload extends MatrixPayload {
  userItemId: number;
}

export interface CreateRelationMatrixCalcPayload extends RelationMatrixPayload {
  userItemId: number;
}

export interface CreateTaroCalcPayload extends TaroPayload {
  userItemId: number;
}
