import { withParams } from '@krutoo/fetch-tools/url';
import { call, put, select, take, takeLeading } from 'typed-redux-saga';
import { MatrixFormType } from '#features/matrix-form';
import { TaroFormType } from '#features/taro-form';
import { UiSlice } from '#features/ui';
import { ItemsSlice } from '#features/user-items';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { ItemUsingSlice } from './slice';

export const ItemUsingSagas = {
  *init(deps: Deps) {
    yield* takeLeading(ItemUsingSlice.actions.fetch, ItemUsingSagas.fetch, deps);
    yield* takeLeading(ItemUsingSlice.actions.formSubmit, ItemUsingSagas.onFormSubmit, deps);
    yield* takeLeading(ItemUsingSlice.actions.fullRequested, ItemUsingSagas.onFullRequested, deps);
    yield* takeLeading(ItemUsingSlice.actions.freeChosen, ItemUsingSagas.onFreeChosen);
  },

  *fetch(deps: Deps, { payload }: ReturnType<typeof ItemUsingSlice.actions.fetch>) {
    try {
      const form = yield* select(ItemUsingSlice.selectors.form);

      if (!form) {
        throw 'Не удалось определить тип формы';
      }

      const response = yield* call(() => deps.api.createCalc({ ...form?.data, ...payload }));

      if (response.ok) {
        yield* put(ItemUsingSlice.actions.fetchDone({ data: response.data }));

        if (form.data.serviceCode === 'TARO_SPREAD') {
          location.assign(new Request(`/taro-result?taroCalcId=${response.data.id}`).url);
        } else {
          location.assign(new Request(`/matrix-result?matrixCalcId=${response.data.id}`).url);
        }
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(ItemUsingSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },

  *onFormSubmit(_deps: Deps, { payload }: ReturnType<typeof ItemUsingSlice.actions.formSubmit>) {
    yield* put(ItemsSlice.actions.fetch({ targetService: payload.form.data.serviceCode }));

    const result = yield* take([ItemsSlice.actions.fetchDone, ItemsSlice.actions.fetchFail]);

    if (ItemsSlice.actions.fetchDone.match(result) && result.payload.data) {
      if (result.payload.data.length > 0) {
        yield* put(
          UiSlice.actions.modalOpen({
            modalType: 'item-using',
            items: result.payload.data,
          }),
        );
      } else {
        yield* put(ItemUsingSlice.actions.freeChosen());
      }
    }
  },

  *onFullRequested(
    _deps: Deps,
    { payload }: ReturnType<typeof ItemUsingSlice.actions.fullRequested>,
  ) {
    yield* put(ItemsSlice.actions.fetch({ targetService: payload.serviceCode }));

    const result = yield* take([ItemsSlice.actions.fetchDone, ItemsSlice.actions.fetchFail]);

    if (!ItemsSlice.actions.fetchDone.match(result)) {
      location.assign(new Request('/#pricing').url);
      return;
    }

    if (!result.payload.data?.length) {
      location.assign(new Request('/#pricing').url);
      return;
    }

    yield* put(
      UiSlice.actions.modalOpen({
        modalType: 'item-using',
        items: result.payload.data,
      }),
    );
  },

  *onFreeChosen() {
    const form = yield* select(ItemUsingSlice.selectors.form);

    if (!form) {
      return;
    }

    const payload: Record<string, string | number | null | undefined> = {};

    if (form.data.serviceCode === 'TARO_SPREAD') {
      let taroType: TaroFormType = 'classic';

      if (form.data.pickedCards.length === 3) {
        taroType = 'three-cards';
      } else if (form.data.pickedCards.length === 1) {
        taroType = 'yes-no';
      }

      Object.assign(payload, {
        taroType,
        question: form.data.question,
        cardIndices: form.data.pickedCards.join(','),
      });
    } else if (form.data.serviceCode === 'RELATION_MATRIX') {
      const matrixType: MatrixFormType = 'relation';

      Object.assign(payload, {
        matrixType,
        partner1Name: form.data.name,
        partner1BirthDate: form.data.birthDate,
        partner2Name: form.data.name2,
        partner2BirthDate: form.data.birthDate2,
      });
    } else {
      let matrixType: MatrixFormType = 'personal';

      if (form.data.serviceCode === 'CHILDREN_MATRIX') {
        matrixType = 'childish';
      } else if (form.data.serviceCode === 'FINANCE_MATRIX') {
        matrixType = 'finances';
      }

      Object.assign(payload, {
        matrixType,
        name: form.data.name,
        birthDate: form.data.birthDate,
      });
    }

    location.assign(withParams(new Request(form.action).url, payload));
  },
} as const;
