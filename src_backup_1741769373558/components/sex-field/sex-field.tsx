import { useIsomorphicLayoutEffect } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, useState } from 'react';
import { Button, ButtonProps } from '#components/button';
import styles from './sex-field.m.css';

export interface SexFieldProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  viewSize?: ButtonProps['size'];
  required?: boolean;
  name?: string;
  onValueChange?: (value: 'male' | 'female') => void;
}

export function SexField({
  disabled,
  value,
  defaultValue,
  name = 'sex',
  required,
  viewSize,
  className,
  onValueChange,
  ...restProps
}: SexFieldProps) {
  const [currentValue, setCurrentValue] = useState(value ?? defaultValue ?? '');

  useIsomorphicLayoutEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);

  return (
    <div className={classNames(styles.root, disabled && styles.disabled, className)} {...restProps}>
      <div className={styles.radio}>
        <input
          disabled={disabled}
          className={styles.input}
          name={name}
          type='radio'
          value='male'
          required={required}
          checked={currentValue === 'male'}
          onChange={() => {
            setCurrentValue('male');
            onValueChange?.('male');
          }}
        />
        <Button size={viewSize} as='span' color='unset' coloring='outline' className={styles.view}>
          Мужской
        </Button>
      </div>

      <div className={styles.radio}>
        <input
          disabled={disabled}
          className={styles.input}
          name={name}
          type='radio'
          value='female'
          required={required}
          checked={currentValue === 'female'}
          onChange={() => {
            setCurrentValue('female');
            onValueChange?.('female');
          }}
        />
        <Button size={viewSize} as='span' color='unset' coloring='outline' className={styles.view}>
          Женский
        </Button>
      </div>
    </div>
  );
}
