import { useState } from "react"
import { AIPT_WEB_TOKEN } from "utils/constants/config"
import { useMemo } from "react"
import pages from "pages"
import { AppFooter, AppHeader, SpinCustom } from "components"
import { findPageByPath, findChildByName, isEmpty } from "utils/helps"
import { useLocation } from "react-router-dom"
import {
  Form, Input, Menu, Layout
} from "antd"
import './index.scss'

const IconHomeNavigate = () => {
  const currentPath = useLocation().pathname

  // menu items
  const items = pages.filter(page => page?.auth === true && page?.label && !page?.parent)
    .map(page => {
      const children = findChildByName(page?.name)
      let item = {
        key: page?.name,
        icon: page?.icon,
        label: page?.label,
      }

      if (!isEmpty(children)) {
        item.children = children
      }
      return item
    });

  // menu default selected key
  const selectedKeys = useMemo(() => {
    const page = findPageByPath(currentPath, pages)
    let key = page?.name

    if (!key) {
      key = 'home'
    }
    else if (key === 'file-preview') {
      key = 'document'
    }

    return key
  }, [currentPath])

  return (
    <Layout className="common-layout home-navigate">
      <AppHeader />
      <div className='common-layout--content'>
        {/* {items} */}
        <Menu
          className="item-center"
          items={items}
          theme="light"
          mode="inline"
          onClick={(e) => window.navigatePage(e.key)}
          defaultSelectedKeys={selectedKeys}
        />
      </div>
      <AppFooter />
    </Layout>
  )
}

export default IconHomeNavigate