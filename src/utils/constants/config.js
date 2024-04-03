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

};

export const VEHICLE_STATUS = {
  0: "Chưa sử dụng",
  1: "Đang chờ duyệt",
  2: "Đang sử dụng",
};

export const TYPE_OVER_TIME = {
  0: "Cuối ngày",
  1: " Cuối tuần( chủ nhật)",
  2: "Ngày lễ tết"
}

export const NOTARIZATION_PROCEDURE_TYPES = {
  0: "Công chứng tư",
  1: "Công chứng công",
};

export const TYPE_CV = {
  0: "Hồ sơ thường",
  1: "Hồ sơ tiềm năng",
};

export const EXPERIENCE = {
  0: "Không cần kinh nghiệm",
  1: "Dưới 1 năm",
  2: "Từ 1 đến 2 năm",
  3: "Từ 2 đến dưới 3 năm",
  4: "Từ 3 đến dưới 5 năm",
  5: "Trên 5 năm",
};

export const EDUCATION_LEVEL = {
  1: "12/12",
  2: "Sơ cấp",
  3: "Trung cấp",
  4: "Cao đẳng",
  5: "Đại học",
  6: "Trên đại học",
};

export const USE_NEEDS = {
  1: "Ngắn hạn",
  2: "Dài hạn",
};

export const GENDER = {
  0: "Nữ",
  1: "Nam",
};

export const INTERVIEW_STATUS = {
  0: "Phỏng vấn vòng 1", //chờ phỏng vấn v1
  1: "Phỏng vấn vòng 2", //chờ phỏng vấn v2
  2: "Đang duyệt", // cho sep duyet
  3: "Đã duyệt ",
  4: "Chờ nhận việc", // cho nhan viec
  5: "Đã nhận việc",
  6: "Không nhận việc",
};

export const STATUS = {
  ACCEPT: 1,
  REFUSE: 0,
}; //dung cho nhieu quy trinh, xem xet khi cap nhat code

export const DEATAIL_STATUS = {
  PENDING: 1,
  D_CONFIRMED: 2,
  SUCCESS: 3,
  CANCEL: 4,
};

export const STATUS_KEEPING = {
  1: "Giờ vào",
  0: "Giờ ra",
};

export const STATUS_FREE_TIME = {
  1: "Đồng ý",
  0: "Từ chối",
};

export const TYPE_DAY = {
  0: "Ngày thường",
  1: "Ngày nghỉ(chủ nhật)",
  2: "Ngày lễ",
};

export const TYPE_KEEPING = {
  0: "Đi công tác",
  1: "Xin nghỉ",
  2: "Đi muộn"
}

export const PROPOSE_STATUS = {
  ACCEPT: 0,
  PROPOSE: 1,
  ACCEPT_PROPOSE: 2,
  REFUSE_PROPOSE: 3
}

export const PROPOSE_DISPLAY = {
  0: 'Đã xác nhận',
  1: 'Đã kiến nghị',
  2: 'Kiến nghị được duyệt',
  3: 'Kiến nghị bị từ chối'
}