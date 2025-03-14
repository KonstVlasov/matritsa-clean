import { InputMask, createInputMask } from '@krutoo/input-mask/dom';
import { useIsomorphicLayoutEffect, useMergeRefs } from '@krutoo/utils';
import { ChangeEvent, useRef, useState } from 'react';
import { Input, InputProps } from '#components/input';

export interface DateInputProps extends InputProps {
  onChange?: (event: ChangeEvent<HTMLInputElement>, meta?: { initial: boolean }) => void;
}

export function DateInput({
  inputRef,
  value,
  defaultValue,
  onChange,
  onInput,
  ...restProps
}: DateInputProps) {
  const [currentValue, setCurrentValue] = useState<string>(() =>
    String(value ?? defaultValue ?? ''),
  );
  const ref = useRef<HTMLInputElement>(null);

  const [inputMask, setInputMask] = useState<InputMask | null>(null);

  useIsomorphicLayoutEffect(() => {
    const input = ref.current;

    if (!input) {
      return;
    }

    const im = createInputMask(input, {
      mask: '__.__.____',
      onInput: state => {
        setCurrentValue(state.value);

        const nativeEvent = new InputEvent('input');
        const syntheticEvent = {
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

        onInput?.(syntheticEvent);
        onChange?.(syntheticEvent);
      },
    });

    im.setValue(currentValue);

    setInputMask(im);

    const nativeEvent = new InputEvent('input');

    onChange?.(
      {
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
      },
      { initial: true },
    );

    return () => {
      im.disable();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!inputMask) {
      return;
    }

    inputMask.setValue(String(value ?? ''));
  }, [value, inputMask]);

  const mergedRef = useMergeRefs([ref, inputRef]);

  return <Input inputRef={mergedRef} {...restProps} />;
}
