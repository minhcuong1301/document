import api from "utils/service/api";

export const actionCreateOfficeProcurementProposal = (data, params) => {
  return api({
    method: "post",
    url: "/create-office-procurement-proposal-procedure",
    data,
    params
  })
}
export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
}

export const actionGetOfficeProcurementProposal = (params) => {
  return api({
    method: "get",
    url: "/get-office-procurement-proposal-procedures",
    params
  })
}

export const actionGetPendingOfficeProcurementProposal = (params) => {
  return api({
    method: "get",
    url: "/get-pending-office-procurement-proposal-procedures",
    params
  })
}

export const actionApproveOfficeProcurementProposal = (procedure_id, status, params) => {
  return api({
    method: "put",
    url: `/approve-office-procurement-proposal-procedure/${procedure_id}/${status}`,
    params
  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-office-procurement-proposal-procedure/${id}`,
    params,
    data: {description}
  })
}