import api from '../../utils/service/api';

export const actionGetListHistory = (params) => {
  return api({
    method: "GET",
    url: "/get-list-history",
    params
  })
}

export const actionDeleteHistory = (data) => {
  return api({
    method: "POST",
    url: '/delete-list-history',
    data
  })
}