import api from "utils/service/api";

export const actionHandleGetListOverTimePending = (params) => {
  return api({
    method: "get",
    url: "/get-list-pending-procedure-overtime",
    params,
  });
};

export const actionGetListOverTime = (params) => {
  return api({
    method: "get",
    url: "/get-list-procedure-overtime",
    params,
  })
}

export const actionHandleAddOverTime = (data) => {
  return api({
    method: "POST",
    url: "/create-procedure-overtime",
    data,
  })
}

export const actionApproveOverTime = (procedure_id, stt, params) => {
  return api({
    method: "put",
    url: `/approve-procedure-overtime/${procedure_id}/${stt}`,
    params,
  })
}

export const actionCancelOverTime = (procedure_id, data) => {
  return api({
    method: "post",
    url: `/cancel-procedure-overtime/${procedure_id}`,
    data,
  })
}

export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
} 