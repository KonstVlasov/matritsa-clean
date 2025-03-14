import { MouseEvent } from 'react';

export function safeQuerySelector(query: string) {
  try {
    return document.querySelector(query);
  } catch {
    return null;
  }
}

export function scrollToAnchorOnClick(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.href;

  if (!href) {
    return;
  }

  const url = new URL(href);

  if (!url.hash) {
    return;
  }

  const target = safeQuerySelector(url.hash);

  if (!(target instanceof HTMLElement)) {
    return;
  }

  event.preventDefault();
  history.pushState(null, document.title, url.href);

  scrollPageTo(target);
}

export function scrollToAnchorFromLocation(options: { behavior?: ScrollBehavior } = {}) {
  const url = new URL(location.href);

  if (!url.hash) {
    return;
  }

  const target = safeQuerySelector(url.hash);

  if (!(target instanceof HTMLElement)) {
    return;
  }

  scrollPageTo(target, options);
}

export function scrollPageTo(
  target: Element,
  { behavior = 'smooth' }: { behavior?: ScrollBehavior } = {},
) {
  const docRect = document.documentElement.getBoundingClientRect();
  const targetRect = target?.getBoundingClientRect();

  // @todo удалить из этой функции
  const mql = matchMedia('(min-width: 1024px)');
  const correction = mql.matches ? -80 : 0;

  window.scrollTo({
    top: targetRect.top - docRect.top + correction,
    behavior: behavior,
  });
}
