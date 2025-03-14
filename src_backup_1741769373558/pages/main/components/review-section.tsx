import { clamp } from '@krutoo/utils';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from '#components/carousel';
import { ReviewsSlice } from '#features/reviews';
import ArrowSVG from '#icons/arrow.svg';
import StarSVG from '#icons/star.svg';
import styles from './review-section.m.css';

export function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ReviewsSlice.actions.fetch());
  }, [dispatch]);

  const status = useSelector(ReviewsSlice.selectors.status);
  const reviews = useSelector(ReviewsSlice.selectors.data);

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.reviews}>
          <Carousel targetIndex={currentIndex}>
            {status === 'success' && reviews && (
              <>
                {reviews.map(review => (
                  <Review key={review.id} title={`${review.author}:`} rating={review.stars}>
                    "{review.content}"
                  </Review>
                ))}
              </>
            )}
          </Carousel>

          <button
            type='button'
            className={classNames(styles.arrow, styles.backward)}
            onClick={() => setCurrentIndex(n => Math.max(0, n - 1))}
          >
            <ArrowSVG />
          </button>
          <button
            type='button'
            className={classNames(styles.arrow, styles.forward)}
            onClick={() => setCurrentIndex(n => Math.min(7, n + 1))}
          >
            <ArrowSVG />
          </button>
        </div>
      </div>
    </section>
  );
}

function Review({
  title,
  children,
  rating = 5,
}: {
  title?: string;
  children?: ReactNode;
  rating?: number;
}) {
  return (
    <div className={styles.review}>
      <div className={styles.reviewStars}>
        {Array(clamp(Math.floor(rating), 1, 5))
          .fill(0)
          .map((zero, index) => (
            <StarSVG key={index} />
          ))}
      </div>

      <div className={styles.reviewTitle}>{title}</div>

      <div className={styles.reviewContent}>{children}</div>
    </div>
  );
}
