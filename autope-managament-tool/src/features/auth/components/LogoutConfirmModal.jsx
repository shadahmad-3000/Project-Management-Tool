import { Modal } from "antd";

export const showLogoutConfirm = (onConfirm) => {
  console.log("showLogoutConfirm CALLED");
  Modal.confirm({
    title: "Are you sure you want to log out?",
    content: "You will be logged out of your account.",
    okText: "Yes, Logout",
    cancelText: "Cancel",
    centered: true,
    onOk: onConfirm,
  });
};
