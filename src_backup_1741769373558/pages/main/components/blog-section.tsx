import classNames from 'classnames';
import { HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '#components/button';
import { Api, BlogPost } from '#shared/api';
import { Status } from '#shared/types';
import styles from './blog-section.m.css';

export function BlogSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const [postsState, setPostsState] = useState<{
    status: Status;
    data: null | BlogPost[];
    error: null | string;
  }>(() => ({
    status: 'initial',
    data: null,
    error: null,
  }));

  useEffect(() => {
    setPostsState({ data: null, status: 'fetching', error: null });

    new Api({
      fetch: (...args) => fetch(...args),
      host: import.meta.env.API_HOST,
    })
      .getBlogPosts()
      .then(res => {
        if (!res.ok) throw res.data;
        setPostsState({ data: res.data, status: 'success', error: null });
      })
      .catch(cause => {
        setPostsState({ data: null, status: 'failure', error: String(cause) });
      });
  }, []);

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <div className={styles.layout}>
        <h2 className={styles.title}>Блог</h2>

        <div className={styles.posts}>
          {(postsState.status === 'initial' || postsState.status === 'fetching') && (
            <>
              {Array(4)
                .fill(0)
                .map((zero, index) => (
                  <Post key={index} loading />
                ))}
            </>
          )}
          {postsState.status === 'success' &&
            postsState.data &&
            postsState.data.slice(0, 4).map(post => <Post key={post.id} {...post} />)}
        </div>
      </div>
    </section>
  );
}

function Post({
  id,
  title,
  image,
  excerpt,
  loading,
  slug,
}: Partial<BlogPost> & { loading?: boolean }) {
  return (
    <div className={classNames(styles.post, loading && styles.loading)}>
      {loading && <div className={styles.postImage} />}
      {!loading && <img src={image} alt='' className={styles.postImage} />}
      <h4 className={styles.postTitle}>{title}</h4>
      <p className={styles.postExcerpt}>{excerpt}</p>
      <Button
        as='anchor'
        href={slug ? `/blog-post/${slug}` : `/blog-post?id=${id}`}
        size='unset'
        endIcon='arrow'
        color='#e6e8f0'
        className={styles.postLink}
      >
        Читать
      </Button>
    </div>
  );
}
