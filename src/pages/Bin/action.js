import api from "utils/service/api";

export const actionDeleteForever = (data) => {
  return api({
    method: "POST",
    url: '/delete-forever-document',
    data
  })
}