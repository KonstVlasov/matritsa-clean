import { getDeclination, useMatchMedia } from '@krutoo/utils';
import classNames from 'classnames';
import { FormEventHandler, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { Select } from '#components/select';
import { CardPickedEvent, PickedCards, TaroPicker } from '#components/taro-picker';
import { ItemUsingSlice } from '#features/item-using';
import { JwtSlice } from '#features/jwt';
import { TaroFormSlice } from '#features/taro-form';
import { ItemsSlice } from '#features/user-items';
import { TaroPayload } from '#shared/api';
import styles from './taro-section.m.css';

const popularQuestions = [
  {
    children: 'Как построить гармоничные отношения?',
  },
  {
    children: 'Произошла ли измена?',
  },
  {
    children: 'Есть ли у него(нее) чувства ко мне?',
  },
  {
    children: 'Как пережить расставание?',
  },
  {
    children: 'Что у него(нее) на душе?',
  },
  {
    children: 'Как пережить трудную ситуацию?',
  },
  {
    children: 'Стоит ли делать предложение?',
  },
  {
    children: 'Как стать привлекательнее?',
  },
  {
    children: 'Стоит ли менять работу?',
  },
  {
    children: 'Как улучшить финансовое положение?',
  },
];

const pageshowHandlers: Array<VoidFunction> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', () => {
    pageshowHandlers.forEach(fn => fn());
  });
}

export function TaroSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const dispatch = useDispatch();

  const desktop = useMatchMedia('(min-width: 1440px)');
  const formType = useSelector(TaroFormSlice.selectors.formType);
  const [question, setQuestion] = useState('');
  const [pickedCards, setPickedCards] = useState<CardPickedEvent[]>(() => []);
  const authorized = useSelector(JwtSlice.selectors.authorized);
  const status = useSelector(ItemsSlice.selectors.status);
  const disabled = status === 'fetching';

  const cardsInfo = useSelector(TaroFormSlice.selectors.data);

  let cardLimit: number;
  switch (formType) {
    case 'yes-no': {
      cardLimit = 1;
      break;
    }
    case 'three-cards': {
      cardLimit = 3;
      break;
    }
    case 'classic':
    default: {
      cardLimit = 5;
      break;
    }
  }

  const addPickedCard = useCallback(
    (event: CardPickedEvent) => {
      setPickedCards(list => (list.length < cardLimit ? [...list, event] : list));
    },
    [cardLimit],
  );

  useEffect(() => {
    setPickedCards([]);
  }, [cardLimit]);

  useEffect(() => {
    pageshowHandlers.push(() => {
      setQuestion('');
      setPickedCards([]);
    });
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = event => {
    if (!authorized) {
      return;
    }

    event.preventDefault();

    const data: TaroPayload = {
      serviceCode: 'TARO_SPREAD',
      question,
      pickedCards: pickedCards.map(c => c.index),
    };

    dispatch(
      ItemUsingSlice.actions.formSubmit({
        formKind: 'taro',
        form: { action: event.currentTarget.action, data },
      }),
    );
  };

  const selectJsx = (
    <Select value={question} onValueChange={setQuestion} options={popularQuestions}>
      Популярные вопросы
    </Select>
  );

  const taroPickerJsx = (
    <TaroPicker
      disabled={question.length === 0 || pickedCards.length === cardLimit}
      className={styles.taroPicker}
      pickedIndices={pickedCards.map(c => c.index)}
      onCardPick={event => {
        addPickedCard(event);
      }}
    />
  );

  const pickedCardsJsx = (
    <PickedCards
      cardLimit={5}
      cards={pickedCards}
      style={{ width: '100%', height: '100%' }}
      getCardName={cardIndex => {
        return cardsInfo?.find(c => c.index === cardIndex)?.name;
      }}
    />
  );

  const cardsFieldJsx = (
    <input
      type='text'
      className={styles.hiddenInput}
      value={pickedCards.length === cardLimit ? pickedCards.map(c => c.index).join(', ') : ''}
      onChange={() => {}}
      name='cardIndices'
      required
      tabIndex={-1}
    />
  );

  const step2Text = `Выберите ${cardLimit} ${getDeclination(cardLimit, ['случайную карту', 'случайных карты', 'случайных карт'])} из колоды`;

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <form
        method='GET'
        action='/taro-result'
        className={classNames(styles.layout, styles.mobile)}
        onSubmit={onSubmit}
      >
        <div className={styles.blockHeading}>
          <h3 className={styles.blockTitle}>ШАГ 01:</h3>
          <div className={styles.message}>{selectJsx}</div>
        </div>

        <input type='hidden' name='taroType' value={formType ?? 'classic'} />

        <textarea
          className={styles.textarea}
          rows={5}
          placeholder='Напишите свой вопрос здесь...'
          value={question}
          onChange={event => setQuestion(event.target.value)}
          name='question'
          required
          autoComplete='off'
        />

        <div className={styles.blockHeading}>
          <h3 className={styles.blockTitle}>ШАГ 02:</h3>
          <div className={styles.message}>{step2Text}</div>
        </div>

        <div className={styles.cardPicker}>{!desktop && taroPickerJsx}</div>

        <div className={styles.pickedCards}>
          {cardsFieldJsx}
          {!desktop && pickedCardsJsx}
        </div>

        <Button
          type='submit'
          endIcon='arrow'
          size='unset'
          className={styles.button}
          disabled={disabled}
        >
          Получить ответ
        </Button>
      </form>

      <form
        method='GET'
        action='/taro-result'
        className={classNames(styles.layout, styles.desktop)}
        onSubmit={onSubmit}
      >
        <div className={styles.column}>
          <div className={styles.blockHeading}>
            <h3 className={styles.blockTitle}>ШАГ 01:</h3>
            <div className={styles.message}>{selectJsx}</div>
          </div>

          <input type='hidden' name='taroType' value={formType ?? 'classic'} />

          <textarea
            className={styles.textarea}
            rows={5}
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder='Напишите свой вопрос здесь...'
            name='question'
            required
            autoComplete='off'
          />

          <div className={styles.pickedCards}>
            {cardsFieldJsx}
            {desktop && pickedCardsJsx}
          </div>

          <Button
            type='submit'
            endIcon='arrow'
            size='unset'
            className={styles.button}
            disabled={disabled}
          >
            Получить ответ
          </Button>
        </div>

        <div className={styles.column}>
          <div className={styles.blockHeading}>
            <h3 className={styles.blockTitle}>ШАГ 02:</h3>
            <div className={styles.message}>{step2Text}</div>
          </div>
          <div className={styles.cardPicker}>{desktop && taroPickerJsx}</div>
        </div>
      </form>
    </section>
  );
}
