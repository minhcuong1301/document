import Cookies from 'js-cookie'
import api from 'utils/service/api'
import { AIPT_WEB_TOKEN, REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'

export const actionAddDocument = (data) => {
  return api({
    method: "POST",
    url: "/add-document",
    data
  })
}

export const actionGetListDocument = (params) => {
  return api({
    method: "GET",
    url: '/seach-document/0',
    params
  })
}

export const actionGetListFolderChid = (params) => {
  return api({
    method: "GET",
    url: '/seach-document/0',
    params
  })
}

export const actionUpdateNameFile = (body) => {
  return api({
    method: "POST",
    url: '/update-name-file',
    data: body
  })
}

export const actionUpdateWorkSpace = (id,data) => {
  return api({
    method: "PUT",
    url: `/update-info/${id}`,
    data: data
  })
}
export const actionDeleteFile = (body) => {
  return api({
    method: "POST",
    url: "/change-status-document",
    data: body
  })
}

export const actionGetImage = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return `${REACT_APP_SERVER_BASE_URL}/download-file/${doc_id}/${as_attachment}/${token}`
}

export const actionDownLoadFile = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  window.open(`${REACT_APP_SERVER_BASE_URL}/download-file/${doc_id}/${as_attachment}/${token}`)
}

export const actionSeachFile = (body) => {
  return api({
    method: "GET",
    url: "/seach-document/0",
    params: body
  })
}

export const actionDetail = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return api({
    method: "GET",
    url: `/download-file/${doc_id}/${as_attachment}/${token}`,
    responseType: 'blob'
  })
}

export const actionGetlistEmpoyee = (params) => {
  return api({
    method: 'GET',
    url: "/get-employees",
    params: params
  })

}

export const actionGetlistDepartment = (params) => {
  return api({
    method: 'GET',
    url: "/get-departments",
    params: params
  })

}

export const actionGetListRole = (params) => {
  return api({
    method: "GET",
    url: "/get-list-role",
    params: params
  })
}

export const actionDecentralize = (params, id_doc) => {
  return api({
    method: "POST",
    url: `/decentralization/${id_doc}`,
    data: params

  })
}

export const actionDecentralizeDep = (params, id_doc) => {
  return api({
    method: "POST",
    url: `/decentralization-department/${id_doc}`,
    data: params

  })
}

export const actionGetListRoleUser = (id_doc, data) => {
  return api({
    method: "POST",
    url: `/get-list-role-user/${id_doc}`,
    data: data
  })
}