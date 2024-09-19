import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useMediaQuery,
  Container,
  Paper,
  Typography,
  useTheme,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  List,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "../../components/axios";
import theme from "../../components/reusable/Theme";
import moment from "moment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; // Import an icon for notifications

// Define the NotificationItem component within the same file
const NotificationItem = ({ notification }) => {
  const [isRead, setIsRead] = useState(notification.status === "read");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = async () => {
    if (!isRead) {
      try {
        await axios.patch(`/notifications/${notification._id}/read`); // Adjust your API endpoint accordingly
        setIsRead(true);
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    navigate(notification.targetUrl);
    console.log("notification.targetUrl", notification.targetUrl);
  };

  const formattedTimestamp = moment(notification.timestamp).format(
    "D/M h:mm A"
  );

  const unreadStyle = {
    bgcolor: isRead ? "background.default" : "background.paper",
    boxShadow: isRead ? "none" : theme.shadows[1],
    "&:hover": {
      bgcolor: isRead ? theme.palette.action.hover : "#e3f2fd",
    },
  };

  return (
    <ListItem
      sx={unreadStyle}
      onClick={handleClick}
      secondaryAction={
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ fontStyle: "italic" }}
        >
          {formattedTimestamp}
        </Typography>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: isRead ? "action.disabledBackground" : "red" }}>
          <NotificationsActiveIcon color={isRead ? "disabled" : "white"} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={notification.message}
        primaryTypographyProps={{
          color: isRead ? "text.disabled" : "text.primary",
          fontWeight: isRead ? "normal" : "fontWeightMedium",
        }}
        secondary={isRead ? "Read" : "Unread"}
      />
    </ListItem>
  );
};

export default function HealthcareNotification() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications"); // Ensure this endpoint matches your API
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete("/notifications/deleteAll");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to delete notifications", error);
    }
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          Notifications
        </Typography>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <NotificationItem notification={notification} />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="subtitle1" sx={{ my: 2 }}>
              You're all caught up! No new notifications.
            </Typography>
          )}
        </List>
      </Paper>
      <Button
        variant="outlined"
        color="primary"
        onClick={deleteAllNotifications}
        sx={{ mb: 2 }}
      >
        Delete All Notifications
      </Button>
    </Container>
  );
}
