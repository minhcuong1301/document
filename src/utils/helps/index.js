import { REACT_APP_SERVER_BASE_URL, AIPT_WEB_TOKEN } from 'utils/constants/config'
import Cookies from "js-cookie";
import pages from 'pages';

const has = Object.prototype.hasOwnProperty;

export const isEmpty = (prop) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
};

export const getRouterParams = (path, params) => {
  if (!isEmpty(params)) {
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key])
    })
  }

  return path
}

export const convertQueryToString = (routerPath, query) => {
  if (typeof query === 'object' && !isEmpty(query)) {
    const querys = [];
    Object.keys(query).forEach(key => {
      querys.push(`${key}=${query[key]}`)
    });
    return `${routerPath}?${querys.join('&')}`
  }
  if (typeof query === 'string') {
    return `${routerPath}${query}`
  }
  return routerPath
};

export const findPageByPath = (currentPath, pages = []) => {
  const page = pages.find(page => {
    const path = new RegExp("^" + page.path.replace(/:[^/]+/g, "([^/]+)") + "$")
    return path.test(currentPath)
  })
  return page
}

export const getUrlUserAvatar = () => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return `${REACT_APP_SERVER_BASE_URL}/get-user-avatar/${token}`
}

export const findChildByName = (name) => {
  return pages.filter(page => page?.parent === name).map(page => ({
    key: page?.name,
    icon: page?.icon,
    label: page?.label,
  }))
}

export const formatCurrency = (number) => {
  let s = parseInt(number)
  s = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s)  
  // s = s.replace('₫', 'VNĐ')
  return s 
}