import React from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from '@/components/home-v2/SiteLayout';
import { blog, posts, postPath, readMinutes } from '@/data/blog';

export const formatDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/** Cover art in two widths; the large one only where the layout needs it. @param {any} props */
export function Cover({ image, sizes, eager = false, className = '' }) {
  return (
    <img
      src={`${image.base}-1600.webp`}
      srcSet={`${image.base}-800.webp 800w, ${image.base}-1600.webp 1600w`}
      sizes={sizes}
      alt={image.alt}
      width="1600"
      height="900"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`block aspect-[16/9] w-full rounded-[clamp(18px,2.4vw,28px)] object-cover ${className}`}
    />
  );
}

function PostMeta({ post }) {
  return (
    <p className="text-[13.5px] text-slate">
      {post.category} <span aria-hidden="true">·</span> <time dateTime={post.date}>{formatDate(post.date)}</time> <span aria-hidden="true">·</span>{' '}
      {readMinutes(post.bodyHtml)} min read
    </p>
  );
}

export default function Blog() {
  const [featured, ...rest] = posts;
  return (
    <SiteLayout meta={{ title: blog.metaTitle, description: blog.metaDescription }}>
      <section aria-labelledby="blog-title" className="pb-[clamp(72px,9vw,128px)] pt-[calc(var(--nav-h)+48px)] md:pt-[calc(var(--nav-h)+72px)]">
        <div className="shell">
          <h1 id="blog-title" className="t-h1">
            {blog.title}
          </h1>
          <p className="t-lead mt-4 max-w-[46ch]">{blog.intro}</p>

          {featured ? (
            <article className="group mt-10 grid gap-6 md:mt-14 md:grid-cols-12 md:items-center md:gap-10">
              <Link to={postPath(featured.slug)} className="md:col-span-7" tabIndex={-1} aria-hidden="true">
                <Cover image={featured.image} sizes="(min-width: 768px) 58vw, 100vw" eager className="transition-opacity duration-300 group-hover:opacity-95" />
              </Link>
              <div className="md:col-span-5">
                <PostMeta post={featured} />
                <h2 className="t-h2 mt-3 text-balance">
                  <Link to={postPath(featured.slug)} className="decoration-brand/40 underline-offset-[6px] hover:underline">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-[40ch] text-[16px] leading-relaxed text-graphite">{featured.dek}</p>
              </div>
            </article>
          ) : null}

          {rest.length ? (
            <ul className="mt-16 grid gap-x-8 gap-y-12 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link to={postPath(p.slug)} tabIndex={-1} aria-hidden="true">
                    <Cover image={p.image} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
                  </Link>
                  <div className="mt-4">
                    <PostMeta post={p} />
                  </div>
                  <h2 className="t-h4 mt-2">
                    <Link to={postPath(p.slug)} className="hover:underline">
                      {p.title}
                    </Link>
                  </h2>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </SiteLayout>
  );
}
