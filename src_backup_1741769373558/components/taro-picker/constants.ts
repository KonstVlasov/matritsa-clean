export const CARD_SIZE = {
  width: 7,
  height: 12,
};

export const CARD_PADDING = Math.min(CARD_SIZE.width, CARD_SIZE.height) * 0.08;

export const FAN_SIZE = {
  width: CARD_SIZE.height + CARD_SIZE.height + CARD_SIZE.width,
  height: CARD_SIZE.height + CARD_SIZE.width,
};
