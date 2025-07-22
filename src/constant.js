const TOAST_PROPS_SUCCESS = {
  duration: 4000,
  position: "top-center",
  style: {
    background: "linear-gradient(to right, #38b000, #70e000)", // green gradient
    color: "#ffffff", // white text/icon
  },
  className: "",
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  removeDelay: 1000,
};

const TOAST_PROPS_ERROR = {
  duration: 4000,
  position: "top-center",
  style: {
    backgroundColor: "#d32f2f", // red
    color: "#ffffff", // white text/icon
  },
  className: "",
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  removeDelay: 1000,
};


export const TOAST_PROPS = {
    success: TOAST_PROPS_SUCCESS,
    error: TOAST_PROPS_ERROR,
}