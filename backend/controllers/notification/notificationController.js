// controllers/notification/notificationController.js
const Notification = require("../../models/Notification");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, message } = req.body;
    const notification = new Notification({
      recipient,
      message,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Adjusted based on the correct way to access userId
    console.log("Fetching notifications for user ID:", userId); // Debugging

    const notifications = await Notification.find({ recipient: userId }).sort({
      timestamp: -1,
    });
    console.log("Found notifications:", notifications); // Debugging

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error); // Debugging
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { status: "read" },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Notification.countDocuments({
      recipient: userId,
      status: "unread",
    });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.deleteMany({ recipient: userId });

    res.status(200).json({ message: "All notifications deleted." });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: error.message });
  }
};
