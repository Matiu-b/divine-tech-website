import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAnchorClick } from '../hooks';

/**
 * One link for every kind of destination on the site:
 * - '/#section' smooth-scrolls on the home page and routes to the home page from anywhere else
 *   (ScrollToTop then scrolls to the section);
 * - '/path' is a client-side route;
 * - anything else (mailto:, tel:, https:) is a plain anchor.
 * @param {any} props
 */
export default function SmartLink({ href, onClick = undefined, children, ...rest }) {
  const { pathname } = useLocation();
  if (href.startsWith('/#')) {
    const hash = href.slice(1);
    if (pathname === '/') {
      return (
        <a
          href={hash}
          onClick={(e) => {
            onAnchorClick(e, hash);
            if (onClick) onClick(e);
          }}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={href} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link to={href} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
