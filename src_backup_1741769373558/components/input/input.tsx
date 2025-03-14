import classNames from 'classnames';
import { InputHTMLAttributes, Ref } from 'react';
import styles from './input.m.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  viewSize?: 's' | 'm' | 'unset';
  inputRef?: Ref<HTMLInputElement>;
}

export function Input({ inputRef, viewSize = 's', className, ...restProps }: InputProps) {
  const rootClassName = classNames(
    //
    styles.input,
    viewSize === 's' && styles['size-s'],
    viewSize === 'm' && styles['size-m'],
    className,
  );

  return <input ref={inputRef} type='text' className={rootClassName} {...restProps} />;
}
