import React from "react";

const Notification = ({ type, message }) => {
  const classes = `notification notification--${type}`;
  return <>{message && <div className={classes}>{message}</div>}</>;
};

export default Notification;
