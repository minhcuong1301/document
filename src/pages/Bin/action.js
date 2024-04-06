import api from "utils/service/api";

export const actionDeleteForever = (data) => {
  return api({
    method: "POST",
    url: '/delete-forever-document',
    data
  })
}

export const actionGetListDocumentDelete = (params) => {
  return api({
    method: "GET",
    url: '/get-list-document-delete',
    params
  })
}

export const actionRestoreDocument = (data) => {
  return api({
    method: "POST",
    url: '/change-status-document',
    data
  })
}