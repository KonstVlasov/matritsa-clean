import fs from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
// @ts-expect-error Cannot find module
import pages from '#static-pages';

for (const { render, outputPath, pageName, title, description } of pages) {
  const outputDir = path.dirname(outputPath);
  const canonicalUrl = `https://matritsa-taro.ru${pageName === 'index' ? '' : '/' + pageName}`;

  console.log(`Generating static page: ${pageName}`);
  console.log(`Title: "${title}"`);
  console.log(`Description: "${description}"`);

  const markup = renderToString(
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#d5d7e9" />
        
        <title>{title}</title>
        <meta content={description} name="description" />
        <meta content={title} property="og:title" />
        <meta content={description} property="og:description" />
        <meta content="website" property="og:type" />
        <meta content={canonicalUrl} property="og:url" />
        <meta content="https://matritsa-taro.ru/public/images/og-image.jpg" property="og:image" />
        <meta content="image/jpeg" property="og:image:type" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content="index, follow" name="robots" />
        <link rel="canonical" href={canonicalUrl} />

        <link
          rel="preload"
          href="/public/fonts/LTSuperior-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/public/fonts/LTSuperior-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/public/fonts/LTSuperior-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/public/fonts/LTSuperior-Semi-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link rel="stylesheet" href="/public/css/fonts.css" />
        <link rel="apple-touch-icon" sizes="180x180" href="/public/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/public/favicon/site.webmanifest" />
      </head>
      <body>
        <div id="root">{render()}</div>
      </body>
    </html>
  );

  const doctype = '<!doctype html>';
  const html = doctype + markup;

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, html);
}
