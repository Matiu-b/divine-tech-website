import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteLayout from '@/components/home-v2/SiteLayout';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import { useLead } from '@/components/home-v2/LeadDrawer';
import PageNotFound from '@/lib/PageNotFound';
import { posts, readMinutes } from '@/data/blog';
import { Cover, formatDate } from './Blog';

function DemoButton() {
  const { open } = useLead();
  return (
    <CTAButton variant="primary" size="lg" onClick={() => open()}>
      Book a demo
    </CTAButton>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <PageNotFound />;
  return (
    <SiteLayout meta={{ title: post.titleTag, description: post.description }}>
      <article aria-labelledby="post-title" className="pb-[clamp(72px,9vw,128px)] pt-[calc(var(--nav-h)+40px)] md:pt-[calc(var(--nav-h)+64px)]">
        <header className="shell">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[13.5px] text-slate">
              <Link to="/blog" className="text-ink underline-offset-4 hover:underline">
                Blog
              </Link>{' '}
              <span aria-hidden="true">·</span> {post.category}
            </p>
            <h1 id="post-title" className="t-h1 mt-4 text-balance">
              {post.title}
            </h1>
            <p className="t-lead mx-auto mt-5 max-w-[52ch]">{post.dek}</p>
            <p className="mt-6 text-[13.5px] text-slate">
              {post.author} <span aria-hidden="true">·</span> <time dateTime={post.date}>{formatDate(post.date)}</time> <span aria-hidden="true">·</span>{' '}
              {readMinutes(post.bodyHtml)} min read
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-[1120px] md:mt-14">
            <Cover image={post.image} sizes="(min-width: 1200px) 1120px, 100vw" eager />
          </div>
        </header>

        {/* Static, trusted copy from src/data/blog.js (also prerendered into the HTML for crawlers). */}
        <div className="shell">
          <div className="prose-blog mx-auto mt-12 max-w-[680px] md:mt-16" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          <div className="mx-auto mt-14 flex max-w-[680px] flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
            <Link to="/blog" className="text-[15px] text-ink underline-offset-4 hover:underline">
              More from the blog
            </Link>
            <DemoButton />
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
