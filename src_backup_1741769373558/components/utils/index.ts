import { Item } from '#shared/api';

export function getItemTitle({ productCode, isSubscription }: Item): string {
  if (productCode === 'PRODUCT_TARO_UNIVERSAL') {
    return isSubscription ? 'Подписка: Таро' : 'Расклад Таро';
  }

  if (productCode === 'PRODUCT_MATRIX_UNIVERSAL') {
    return isSubscription ? 'Подписка: Матрица судьбы' : 'Матрица судьбы';
  }

  if (productCode === 'PRODUCT_MATRIX_PERSONAL') {
    return isSubscription ? 'Подписка: Персональная матрица' : 'Персональная матрица';
  }

  if (productCode === 'PRODUCT_MATRIX_COMPATIBILITY') {
    return isSubscription ? 'Подписка: Матрица совместимости' : 'Матрица совместимости';
  }

  if (productCode === 'PRODUCT_MATRIX_FINANCE') {
    return isSubscription ? 'Подписка: Матрица финансов' : 'Матрица финансов';
  }

  if (productCode === 'PRODUCT_MATRIX_CHILDREN') {
    return isSubscription ? 'Подписка: Детская матрица' : 'Детская матрица';
  }

  return '';
}

export function getItemValueLabel({ productCode, isSubscription }: Item): string {
  if (productCode === 'PRODUCT_TARO_UNIVERSAL') {
    return isSubscription ? 'Доступно раскладов на сегодня' : 'Доступно раскладов';
  }

  return isSubscription ? 'Доступно расшифровок на сегодня' : 'Доступно расшифровок';
}
