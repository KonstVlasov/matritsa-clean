import { InputMask, createInputMask } from '@krutoo/input-mask/dom';
import { useIsomorphicLayoutEffect, useMergeRefs } from '@krutoo/utils';
import { ChangeEvent, ChangeEventHandler, useRef, useState } from 'react';
import { Input, InputProps } from '#components/input';

export type PhoneInputChangeHandler = (
  event: ChangeEvent<HTMLInputElement>,
  meta: { cleanValue: string },
) => void;

export interface PhoneInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: PhoneInputChangeHandler;
}

export function PhoneInput({
  inputRef,
  value,
  defaultValue,
  onChange,
  ...restProps
}: PhoneInputProps) {
  const [currentValue, setCurrentValue] = useState<string>(() =>
    String(value ?? defaultValue ?? ''),
  );
  const [inputMask, setInputMask] = useState<InputMask | null>(null);

  const innerInputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs([inputRef, innerInputRef]);

  useIsomorphicLayoutEffect(() => {
    const input = innerInputRef.current;

    if (!input) {
      return;
    }

    const mask = createInputMask(input, {
      mask: '+7 (___) ___-__-__',
      onInput() {
        dispatchChange(input, event => onChange?.(event, mask.getState()));
      },
    });

    mask.setValue(currentValue);
    setInputMask(mask);

    return () => {
      mask.disable();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!inputMask) {
      return;
    }

    setCurrentValue(String(value ?? ''));
  }, [value]);

  useIsomorphicLayoutEffect(() => {
    if (!inputMask) {
      return;
    }

    inputMask.setValue(currentValue);
  }, [currentValue]);

  return <Input inputRef={mergedRef} {...restProps} />;
}

function dispatchChange(input: HTMLInputElement, onChange?: ChangeEventHandler<HTMLInputElement>) {
  const nativeEvent = new InputEvent('input');
  const syntheticEvent = getSyntheticChangeEvent(nativeEvent, input);

  onChange?.(syntheticEvent);
}

function getSyntheticChangeEvent(
  nativeEvent: InputEvent,
  input: HTMLInputElement,
): ChangeEvent<HTMLInputElement> {
  return {
    type: 'change',
    target: input,
    currentTarget: input,
    nativeEvent,
    timeStamp: nativeEvent.timeStamp,
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    defaultPrevented: nativeEvent.defaultPrevented,
    eventPhase: nativeEvent.eventPhase,
    isTrusted: nativeEvent.isTrusted,
    preventDefault: () => nativeEvent.preventDefault(),
    isDefaultPrevented: () => nativeEvent.defaultPrevented,
    stopPropagation: () => nativeEvent.stopPropagation(),
    isPropagationStopped: () => false,
    persist: () => {},
  };
}
