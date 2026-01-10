import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title', icon } = meta

    const mapIcon = (iconName?: string) => {
      if (!iconName) return iconName
      const map: Record<string, string> = {
        'ep:home-filled': 'svg-icon:lghjft-home-filled',
        'ion:home-outline': 'svg-icon:lghjft-home-outline',
        'ep:shop': 'svg-icon:lghjft-shop',
        'tabler:ai': 'svg-icon:lghjft-ai',
        'simple-icons:erpnext': 'svg-icon:lghjft-erp',
        'simple-icons:civicrm': 'svg-icon:lghjft-crm',
        'fa-solid:hdd': 'svg-icon:lghjft-iot'
      }
      return map[iconName] || iconName
    }

    const finalIcon = mapIcon(icon)

    return finalIcon ? (
      <>
        <Icon icon={finalIcon}></Icon>
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t(title as string)}
        </span>
      </>
    ) : (
      <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
        {t(title as string)}
      </span>
    )
  }

  return {
    renderMenuTitle
  }
}
