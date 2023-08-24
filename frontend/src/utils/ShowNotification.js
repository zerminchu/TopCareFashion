import { notifications } from "@mantine/notifications";

export const showNotifications = (props) => {
  notifications.show({
    title: props.title,
    message: props.message,
    color: props.status === "success" ? "blue" : "red",
  });
}