import { CSSProperties } from 'react';

export interface TaroPickerStyle extends CSSProperties {
  '--taro-picker-card-w'?: string;
  '--taro-picker-card-h'?: string;
  '--taro-picker-center-x'?: string;
  '--taro-picker-center-y'?: string;
}

export interface CardPickedEvent {
  index: number;
  angle: number;
  boundingRect: DOMRect;
  timestamp: number;
}
