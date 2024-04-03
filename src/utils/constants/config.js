// Server config
export const { REACT_APP_SERVER_BASE_URL } = process.env || {};

// export const REACT_APP_SERVER_BASE_URL = "http://117.4.254.94:8006"

// Date time fomart
export const DATETIME_FORMAT = "HH:mm DD-MM-YYYY";
export const DATE_FORMAT = "DD-MM-YYYY";
export const TIME_FORMAT = "HH:mm";
export const SECOND_FORMAT = "HH:mm:ss DD-MM-YYYY";

// Regex
export const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const PHONE_PATTERN =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const PASSWORD_PATTEN = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

// Common Config
export const AIPT_WEB_TOKEN = "AIPT_WEB_DATA_MANAGEMT_TOKEN";
export const SPINNING_SIZE = "large";
export const BTN_SIZE_TABLE = "small";

export const DEPARTMENTS_CODE = {
  1: "Phòng ban 1",
  2: "Phòng ban 2",
  3: "Phòng ban 3",
  //   4: "Phòng xuất nhập khẩu",
  //   5: "Phòng kế toán",
  //   6: "Phòng hành chính nhân sự",
  //   7: "Phòng kinh doanh",
};



export const GENDER = {
  0: "Nữ",
  1: "Nam",
};

export const TYPE_POWER = {
  0: "Nhân viên",
  1: "Phòng ban",
}
export const POSITION_CODE = {
  1: "Admin",
  2: "Nhân viên",
};

