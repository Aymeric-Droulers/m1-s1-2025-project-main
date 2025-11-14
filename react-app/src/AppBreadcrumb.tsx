import { Breadcrumb } from 'antd'
import { useBreadcrumbProvider } from './useBreadcrumbProvider'

export function AppBreadcrumb() {
  const { items } = useBreadcrumbProvider()

  if (!items || items.length === 0) return null

  return <Breadcrumb separator=">" items={items} />
}
