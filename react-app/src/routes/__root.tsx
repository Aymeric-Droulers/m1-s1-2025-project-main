import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from '../Layout'
import { AppBreadcrumb } from '../AppBreadcrumb'

const RootLayout = () => {
  return (
    <Layout>
      <AppBreadcrumb />
      <Outlet />
    </Layout>
  )
}

export const Route = createRootRoute({ component: RootLayout })
