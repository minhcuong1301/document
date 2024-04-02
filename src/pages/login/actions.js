import api from "utils/service/api";
import * as actions from 'utils/constants/redux-actions'
import socketIO from 'utils/service/socketIO'

export const actionLogin = (data) => {
  return api({
    method: "POST",
    url: "/user-login",
    data
  })
}

export const actionGetUserProfileByToken = async (dispatch) => {
  try {
    // get user info
    const { status, data } = await api({
      method: "GET",
      url: "/get-user-profile-by-token"
    })

    // set profile state
    if (status === 200) {
      socketIO.emit('join', data)
      
      dispatch({ type: actions.SET_PROFILE, payload: data })
    }
  } catch (error) {
    window.navigatePage('login')
    console.log(error)
  }
}