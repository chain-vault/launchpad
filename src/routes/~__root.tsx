import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import React, { Suspense } from 'react';

import Layout from '@components/Layout';

import '@utils/dayjsFormating';

const TanStackRouterDevtools =
  import.meta.env.MODE !== 'development' || window.location.pathname.indexOf('swap') > -1 ?
    () => null // Render nothing in all modes other than development
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      }))
    );

export const Route = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Layout>
        <Outlet />
      </Layout>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
