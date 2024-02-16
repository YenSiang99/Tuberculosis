import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  IconButton,
  Chip,
  useMediaQuery,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "../../components/axios";
import DataViewer from "../../components/reusable/DataViewer";



const localizer = momentLocalizer(moment);

export default function PatientCalendar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const daysPassed = moment().diff(moment().startOf("month"), "days") + 1;

  // Date time varialbes
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const [videoData, setVideoData] = useState([]);

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const CustomToolbar = ({ onNavigate, label }) => {
    const navigate = (action) => {
      const newDate = moment(label, "MMMM YYYY");
      if (action === "PREV") {
        newDate.subtract(1, "month");
      } else if (action === "NEXT") {
        newDate.add(1, "month");
      }
      handleMonthChange(newDate.month(), newDate.year());
      onNavigate(action);
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        <IconButton onClick={() => navigate("PREV")}>
          <NavigateBefore />
        </IconButton>
        <span>{label}</span>
        <IconButton onClick={() => navigate("NEXT")}>
          <NavigateNext />
        </IconButton>
      </Box>
    );
  };

  const generateTrackerEvents = (month, year) => {
    // Correctly initialize the moment object with the desired month and year
    const startDate = moment()
      .set({ year: year, month: month })
      .startOf("month");
    const endDate = moment().isSame(
      moment().set({ year: year, month: month }),
      "month"
    )
      ? moment()
      : moment().set({ year: year, month: month }).endOf("month");
    const dates = [];

    // Loop through the month to create event dates, but only up to today
    for (
      let date = startDate.clone();
      date.isSameOrBefore(endDate);
      date.add(1, "days")
    ) {
      dates.push({
        start: date.toDate(),
        end: date.toDate(),
        allDay: true,
      });
    }

    return dates;
  };

  const calculateProgress = (events) => {
    const today = moment();
    const startOfMonth = moment().startOf("month");
    const daysPassed = today.diff(startOfMonth, "days") + 1;

    const submittedCount = events.filter((event) => {
      let eventDate = moment(event.start);
      return eventDate.isSameOrBefore(today, "day");
    }).length;

    return Math.round((submittedCount / daysPassed) * 100);
  };

  const wasVideoSubmitted = (date) => {
    // Check if the date is today or in the past
    return moment(date).isSameOrBefore(moment(), "day");
  };

  const calculateMonthlyProgress = (events, month, year) => {
    const monthEvents = events.filter((event) => {
      const eventMonth = moment(event.start).month();
      const eventYear = moment(event.start).year();
      return eventMonth === month && eventYear === year;
    });

    const submittedCount = monthEvents.filter((event) =>
      wasVideoSubmitted(event.start)
    ).length;
    const totalDays = moment().month(month).year(year).daysInMonth();

    return {
      submittedCount,
      percentage: Math.round((submittedCount / totalDays) * 100),
    };
  };

  const getEncouragingWords = (progress, daysPassed, submittedCount) => {
    if (submittedCount === daysPassed) {
      return "Fantastic! Keep the streak going!";
    } else if (progress >= 75) {
      return "You're doing great! Keep it up!";
    } else if (progress < 50) {
      return "Let's try to improve your routine, you can do it!";
    } else {
      return "You're on the right track!";
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 50) return "#ff4c4c";
    if (progress < 75) return "#FF9300";
    return "#32CD32";
  };

  const events = generateTrackerEvents(selectedMonth, selectedYear);
  const progress = calculateProgress(events);
  const { submittedCount, percentage } = calculateMonthlyProgress(
    events,
    selectedMonth,
    selectedYear
  );
  const encouragingWords = getEncouragingWords(
    percentage,
    daysPassed,
    submittedCount
  );

  function SemiCircleProgressBar({ progress, size = 500 }) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const strokeDashoffset = ((100 - progress) / 100) * circumference;
    const progressColor = getProgressColor(progress);
    const percentageFontSize = size * 0.1;

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: size / 2,
        }}
      >
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size}`}>
          <path
            d={`M ${strokeWidth / 2},${size / 2} 
              a ${radius},${radius} 0 0,1 ${size - strokeWidth},0`}
            fill="none"
            stroke={theme.palette.grey[300]}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${strokeWidth / 2},${size / 2} a ${radius},${radius} 0 0,1 ${
              size - strokeWidth
            },0`}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <Typography
          variant="h3"
          component="div"
          sx={{
            position: "absolute",
            fontSize: `${percentageFontSize}px`,
            fontWeight: "bold",
            color: progressColor,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    // let newStyle = {
    //   borderRadius: "0px",
    //   border: "none",
    // };

    // if (wasVideoSubmitted(start)) {
    //   newStyle.backgroundColor = "#7CC36A";
    // } else {
    //   newStyle.backgroundColor = "#ff4c4c";
    // }

    // return {
    //   style: newStyle,
    // };
  };

  const Legend = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      {/* <Chip label="Video Submitted" sx={{ bgcolor: "#7CC36A", mr: 1 }} /> */}
      {/* <Chip label="Video Not Submitted" sx={{ bgcolor: "#ff4c4c" }} /> */}
    </Box>
  );

  const dayPropGetter = (date) => {
    // let style = {
    //   backgroundColor: "",
    //   borderRadius: "0px",
    // };

    // if (moment(date).isSameOrBefore(moment(), "day")) {
    //   style.backgroundColor = wasVideoSubmitted(date) ? "#7CC36A" : "#ff4c4c";
    // }

    // return {
    //   style: style,
    // };
    let style = {
      backgroundColor: "",
      borderRadius: "0px",
    };
  
    // Convert the date to the start of the day for comparison
    const currentDayStart = moment(date).startOf('day');
    const todayStart = moment().startOf('day');
  
    if (currentDayStart.isBefore(todayStart)) { // Check only for days before today
      const hasUploaded = videoData.some(video => {
        const videoDate = moment(video.date).startOf('day');
        // Check if the video's date is the same as the current day and status is not 'pending upload for today'
        return currentDayStart.isSame(videoDate) && video.status !== 'pending upload for today';
      });
  
      style.backgroundColor = hasUploaded ? "#7CC36A" : "#ff4c4c"; // Green if uploaded, red if not
    } else {
      // For today or future dates, you might want to set a default or leave it unstyled
      style.backgroundColor = ""; // No color or whatever default you wish
    }
  
    return {
      style: style,
    };
  };

  const Event = ({ event }) => {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "5px",
          opacity: 0.8,
        }}
      />
    );
  };

  const fetchVideoData = async (year, month) => {
    try {
      const response = await axios.get(
        `/videos//getVideo?year=${year}&month=${month}`
      );
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching Available Date Time Slots:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    // Call the getOrCreateVideo API to check or create a video for the day
    console.log("use effect hook called");
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    fetchVideoData(year, month);
  }, [selectedDate]);
  

 

  return (
    <ThemeProvider theme={theme}>
      {useMediaQuery(theme.breakpoints.down("sm")) && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            m: 1,
            display: { sm: "block", md: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={
          useMediaQuery(theme.breakpoints.down("sm"))
            ? "temporary"
            : "permanent"
        }
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <PatientSidebar handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: "240px", md: "240px" },
        }}
      >
        <Container>
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
              Progress Tracker
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SemiCircleProgressBar progress={percentage} size={500} />
              <Typography variant="h6" sx={{ fontWeight: "medium", mt: -6 }}>
                {submittedCount}/
                {moment().month(selectedMonth).year(selectedYear).daysInMonth()}{" "}
                videos submitted in{" "}
                {moment()
                  .month(selectedMonth)
                  .year(selectedYear)
                  .format("MMMM YYYY")}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  mt: 1,
                  mb: 4,
                  color: getProgressColor(percentage),
                  fontWeight: "bold",
                }}
              >
                {encouragingWords}
              </Typography>
            </Box>
             <DataViewer data={videoData} variableName="videoData for the month"></DataViewer>

            <Calendar
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "60vh" }}
              views={{ month: true, agenda: true }}
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
                event: Event,
              }}
            />
            <Legend />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
