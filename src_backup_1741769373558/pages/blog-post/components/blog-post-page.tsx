import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { URLPattern } from 'urlpattern-polyfill/urlpattern';
import { PageLoading } from '#components/page-loading';
import { PageRoot } from '#components/page-root';
import { StyledMarkup } from '#components/styled-markup';
import { PageFooter } from '#containers/page-footer';
import { PageHeader } from '#containers/page-header';
import { Api, BlogPost } from '#shared/api';
import { Status } from '#shared/types';
import styles from './blog-post-page.m.css';

export interface PostPayload {
  postId?: number;
  postSlug?: string;
  empty?: boolean;
}

export function BlogPostPage() {
  const [payload, setPayload] = useState<null | PostPayload>(null);

  useEffect(() => {
    const url = new URL(window.location.href);

    const postId = url.searchParams.get('post-id');
    if (postId !== null && Number.isFinite(parseInt(postId))) {
      setPayload({
        postId: parseInt(postId),
      });
      return;
    }

    const result = new URLPattern({ pathname: '/blog-post/:slug' }).exec(url.href);
    if (result && result.pathname.groups.slug) {
      setPayload({
        postSlug: result.pathname.groups.slug,
      });
      return;
    }

    setPayload({
      empty: true,
    });
  }, []);

  const [postState, setPostState] = useState<{
    status: Status;
    data: null | BlogPost;
    error: null | string;
  }>(() => ({
    status: 'initial',
    data: null,
    error: null,
  }));

  useEffect(() => {
    if (!payload) {
      return;
    }

    if (payload.empty) {
      return;
    }

    setPostState(current => ({
      ...current,
      status: 'fetching',
      error: null,
    }));

    new Api({
      fetch: (...args) => fetch(...args),
      host: import.meta.env.API_HOST,
    })
      .getBlogPost(payload)
      .then(res => {
        if (!res.ok) {
          throw res.data;
        }

        setPostState({ data: res.data, status: 'success', error: null });

        const post: BlogPost = res.data;

        document.head.insertAdjacentHTML(
          'beforeend',
          renderToStaticMarkup(
            <>
              {post.seo_title && <meta name='title' content={post.seo_title} />}
              {post.seo_keywords && <meta name='keywords' content={post.seo_keywords} />}
              {post.seo_description && <meta name='description' content={post.seo_description} />}
            </>,
          ),
        );
      })
      .catch(error => {
        setPostState({ data: null, status: 'failure', error: String(error) });
      });
  }, [payload]);

  return (
    <PageRoot display='flexColumn'>
      <PageHeader />

      <div className={styles.main}>
        {postState.status === 'fetching' && <PageLoading />}

        {postState.status === 'failure' && (
          <div className={styles.error}>
            <h2 className={styles.errorTitle}>Ошибка загрузки</h2>
            <p>Попробуйте позже или вернитесь на главную страницу</p>
          </div>
        )}

        {postState.status === 'success' && postState.data && <PostView post={postState.data} />}
      </div>

      <PageFooter />
    </PageRoot>
  );
}

function PostView({ post }: { post: BlogPost }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.image}>
          <img src={post.image} alt='' />
        </div>

        <div className={styles.excerpt}>{post.excerpt}</div>
      </header>

      <div className={styles.body}>
        <div className={styles.bodyInner}>
          <h2 className={styles.title}>{post.title}</h2>

          <main className={styles.content}>
            <StyledMarkup dangerouslySetInnerHTML={{ __html: post.text }} />
          </main>

          <footer className={styles.bodyFooter}>
            <div className={styles.author}>
              <span className={styles.authorTitle}>Автор статьи:</span>
              <span className={styles.authorValue}>{post.author}</span>
            </div>

            <div className={styles.author}>
              <span className={styles.authorTitle}>Редактор:</span>
              <span className={styles.authorValue}>{post.editor}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
