import { useState } from 'react'
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from 'utils/constants/config'
import moment from 'moment'
import dayjs from 'dayjs'
import "./index.scss"

import {
  Row, Col, DatePicker,
} from 'antd'

const DatePickerCustom = ({setDatetime, disabled}) => {
  const [time, setTime] = useState()
  const [date, setDate] = useState()

  const handleSetDatetime = (time, date) => {
    setTime(time)
    setDate(date)
    
    if (!time || !date) {
      setDatetime(null)
      return
    }

    const time_str = dayjs(time).format(TIME_FORMAT)
    const t = moment(`${time_str} ${date}`, DATETIME_FORMAT).format("x")
    setDatetime(t)
  }

  return (
    <Row gutter={[4, 0]}>
      <Col span={12}>
        <DatePicker
          className="w-full"
          popupClassName='date-picker-custom'
          allowClear={false}
          format={TIME_FORMAT}
          onSelect={(v) => handleSetDatetime(v, date)}
          disabledTime={disabled || null}
          picker='time'
          value={time}
        />
      </Col>

      <Col span={12}>
        <DatePicker
          className="w-full"
          allowClear={false}
          format={DATE_FORMAT}
          onChange={(_, v) => handleSetDatetime(time, v)}
          disabledDate={disabled || null}
        />
      </Col>
    </Row>
  )
}

export default DatePickerCustom