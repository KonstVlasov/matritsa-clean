import { MatrixPayload, RelationMatrixPayload, TaroPayload } from '#shared/api';

export function parseMatrixPersonal(
  data: Record<string, string>,
): Omit<MatrixPayload, 'serviceCode'> | null {
  if (data.matrixType !== 'personal') {
    return null;
  }

  if (typeof data.birthDate !== 'string') {
    return null;
  }

  if (typeof data.name !== 'string') {
    return null;
  }

  return {
    name: data.name,
    birthDate: data.birthDate,
  };
}

export function parseMatrixChildish(
  data: Record<string, string>,
): Omit<MatrixPayload, 'serviceCode'> | null {
  if (data.matrixType !== 'childish') {
    return null;
  }

  if (typeof data.birthDate !== 'string') {
    return null;
  }

  if (typeof data.name !== 'string') {
    return null;
  }

  return {
    name: data.name,
    birthDate: data.birthDate,
  };
}

export function parseMatrixFinances(
  data: Record<string, string>,
): Omit<MatrixPayload, 'serviceCode'> | null {
  if (data.matrixType !== 'finances') {
    return null;
  }

  if (typeof data.birthDate !== 'string') {
    return null;
  }

  if (typeof data.name !== 'string') {
    return null;
  }

  return {
    name: data.name,
    birthDate: data.birthDate,
  };
}

export function parseMatrixRelation(
  data: Record<string, string>,
): Omit<RelationMatrixPayload, 'serviceCode'> | null {
  if (data.matrixType !== 'relation') {
    return null;
  }

  if (!data.partner1Name) {
    return null;
  }

  if (!data.partner1BirthDate) {
    return null;
  }

  if (!data.partner2Name) {
    return null;
  }

  if (!data.partner2BirthDate) {
    return null;
  }

  return {
    name: data.partner1Name,
    birthDate: data.partner1BirthDate,
    name2: data.partner2Name,
    birthDate2: data.partner2BirthDate,
  };
}

export function parseMatrixCalc(data: Record<string, string>): { matrixCalcId: number } | null {
  if (data.matrixCalcId && Number.isFinite(parseInt(data.matrixCalcId))) {
    return {
      matrixCalcId: parseInt(data.matrixCalcId),
    };
  }

  return null;
}

export function parseTaro(value: unknown): Omit<TaroPayload, 'serviceCode'> | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    'question' in value &&
    typeof value.question === 'string' &&
    'cardIndices' in value &&
    typeof value.cardIndices === 'string' &&
    value.cardIndices
      .split(',')
      .map(v => parseInt(v, 10))
      .every(v => !Number.isNaN(v) && Number.isFinite(v))
  ) {
    return {
      question: value.question,
      pickedCards: value.cardIndices.split(',').map(v => parseInt(v, 10)),
    };
  }

  return null;
}

export function parseTaroCalc(value: unknown): { taroCalcId: number } | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    'taroCalcId' in value &&
    typeof value.taroCalcId === 'string' &&
    !Number.isNaN(parseInt(value.taroCalcId))
  ) {
    return {
      taroCalcId: parseInt(value.taroCalcId),
    };
  }

  return null;
}

export function parseAnyForm(
  value: Record<string, string>,
): MatrixPayload | RelationMatrixPayload | TaroPayload | null {
  const matrixPersonal = parseMatrixPersonal(value);
  if (matrixPersonal) {
    return {
      ...matrixPersonal,
      serviceCode: 'PERSONAL_MATRIX',
    };
  }

  const matrixFinances = parseMatrixFinances(value);
  if (matrixFinances) {
    return { ...matrixFinances, serviceCode: 'FINANCE_MATRIX' };
  }

  const matrixChildish = parseMatrixChildish(value);
  if (matrixChildish) {
    return { ...matrixChildish, serviceCode: 'CHILDREN_MATRIX' };
  }

  const matrixRelation = parseMatrixRelation(value);
  if (matrixRelation) {
    return { ...matrixRelation, serviceCode: 'RELATION_MATRIX' };
  }

  const taro = parseTaro(value);
  if (taro) {
    return { ...taro, serviceCode: 'TARO_SPREAD' };
  }

  return null;
}
