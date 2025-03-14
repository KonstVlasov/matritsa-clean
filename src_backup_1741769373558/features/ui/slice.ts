import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import type { Item, Offer } from '#shared/api';

export type ModalPayload =
  | { modalType: 'auth' }
  | { modalType: 'subscribeDone' }
  | { modalType: 'purchase'; offer: Offer }
  | { modalType: 'item-using'; items: Item[] };

export interface UiState {
  modalOrder: ModalPayload[];
}

const sliceName = 'UI';

const initialState: UiState = {
  modalOrder: [],
};

const actions = {
  modalOpen: createAction<ModalPayload>(`${sliceName}/modalOpen`),
  modalBack: createAction(`${sliceName}/modalBack`),
  modalClose: createAction(`${sliceName}/modalClose`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.modalOpen, (state, { payload }) => {
    state.modalOrder.push(payload);
  });

  addCase(actions.modalBack, state => {
    state.modalOrder.pop();
  });

  addCase(actions.modalClose, state => {
    state.modalOrder = [];
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: UiState }): UiState => {
    return state[sliceName];
  };

  const selectCurrentModalType = createSelector(selectSlice, state => {
    return state.modalOrder[state.modalOrder.length - 1];
  });

  return {
    slice: selectSlice,
    currentModalType: selectCurrentModalType,
  };
})();

export const UiSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
