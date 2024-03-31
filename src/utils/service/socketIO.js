import { REACT_APP_SERVER_BASE_URL, AIPT_WEB_TOKEN } from 'utils/constants/config'
import socketIOClient from "socket.io-client";
import Cookies from "js-cookie"
import { message } from 'antd'

const token = Cookies.get(AIPT_WEB_TOKEN)

const socketIO = socketIOClient(
  REACT_APP_SERVER_BASE_URL,
  {
    extraHeaders: {
      "Authorization": `${token}`
    }
  }
)

socketIO.on('message', (data) => {
  const { msg, status } = data

  if (status === 200) {
    message.success(msg)
  } 
  else {
    message.error(msg)
  }
})

export default socketIO