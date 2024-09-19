import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  Chip,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import theme from "../../components/reusable/Theme";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "../../components/axios";
// import DataViewer from "../../components/reusable/DataViewer";
import { format } from "date-fns";

const localizer = momentLocalizer(moment);

export default function PatientCalendar() {
  const daysPassed = moment().diff(moment().startOf("month"), "days") + 1;

  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  const [videoData, setVideoData] = useState([]);
  const [progressData, setProgressData] = useState({
    relativeCompletionPercentage: 0,
  });
  const [encouragingWords, setEncouragingWords] = useState();

  const CustomToolbar = ({ onNavigate, label, onMonthChange }) => {
    const treatmentStartDate = moment(progressData.treatmentStartDate);

    const navigate = (action) => {
      const currentDate = moment(label, "MMMM YYYY");
      let newDate = moment(currentDate);

      if (action === "NEXT") {
        newDate.add(1, "months");
      } else if (action === "PREV") {
        newDate.subtract(1, "months");
      }

      // Check if newDate is before treatmentStartDate
      if (newDate.isBefore(treatmentStartDate, "month")) {
        alert("You cannot access months before your treatment started.");
        return; // Stop the navigation if it's before the treatment start date
      }

      // Proceed with navigation
      onNavigate(action);
      onMonthChange(newDate.toDate());
    };

    // Determine if the PREV button should be disabled
    const isPrevDisabled = moment(label, "MMMM YYYY").isSameOrBefore(
      treatmentStartDate,
      "month"
    );

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        <IconButton onClick={() => navigate("PREV")} disabled={isPrevDisabled}>
          <NavigateBefore />
        </IconButton>
        <span>{label}</span>
        <IconButton onClick={() => navigate("NEXT")}>
          <NavigateNext />
        </IconButton>
      </Box>
    );
  };

  const getProgressColor = (progress) => {
    if (progress < 50) return "#ff4c4c";
    if (progress < 75) return "#FF9300";
    return "#32CD32";
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

  const eventStyleGetter = (event) => {
    let backgroundColor = "#fff"; // Default color
    const style = {
      backgroundColor,
      // Other styles if needed
    };

    return { style };
  };
  const Legend = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Chip
        label="Video Submitted"
        sx={{
          bgcolor: "#7CC36A",
          mr: 1,
          fontSize: "1rem",
          height: "35px",
          "& .MuiChip-label": {
            padding: "0 12px",
          },
        }}
      />
      <Chip
        label="Video Missed"
        sx={{
          bgcolor: "#ff8080",
          fontSize: "1rem",
          height: "35px",
          "& .MuiChip-label": {
            padding: "0 12px",
          },
        }}
      />
    </Box>
  );
  const dayPropGetter = (date) => {
    let style = {
      backgroundColor: "",
      borderRadius: "0px",
    };
    const treatmentStartDate = moment(progressData.treatmentStartDate).startOf(
      "day"
    );
    const calendarDay = moment(date).startOf("day");
    const todayStart = moment().startOf("day");

    const targetYear = moment(calendarViewDate).year();
    const targetMonth = moment(calendarViewDate).month(); // month() returns a 0-based index

    if (
      calendarDay.year() === targetYear &&
      calendarDay.month() === targetMonth
    ) {
      if (calendarDay.isBefore(treatmentStartDate)) {
        style.backgroundColor = "#E0E0E0"; // Light grey for dates before treatment
      } else if (
        calendarDay.isBefore(todayStart) &&
        calendarDay.isSameOrAfter(treatmentStartDate)
      ) {
        const hasUploaded = videoData.some((video) => {
          const videoDate = moment(video.date).startOf("day");
          return calendarDay.isSame(videoDate);
        });
        style.backgroundColor = hasUploaded ? "#7CC36A" : "#ff8080"; // Green if uploaded, red if not
      } else if (calendarDay.isSame(todayStart)) {
        // Check if there is a video uploaded for today
        const todayUploaded = videoData.some((video) =>
          moment(video.date).startOf("day").isSame(todayStart)
        );
        if (todayUploaded) {
          style.backgroundColor = "#7CC36A"; // Green for today if video uploaded
        } else {
          style.backgroundColor = "#FFFFFF"; // White for today if no video uploaded
        }
      } else if (calendarDay.isAfter(todayStart)) {
        style.backgroundColor = "#E0E0E0"; // Grey out future dates
      }
    } else {
      style.backgroundColor = ""; // No specific style for dates outside the target month/year
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

  // Api functions
  // const fetchVideoData = async (year, month) => {
  //   try {
  //     const response = await axios.get(
  //       `/videos/getVideo?year=${year}&month=${month}`
  //     );
  //     setVideoData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching Available Date Time Slots:", error);
  //     // Handle the error as needed
  //   }
  // };
  // const fetchProgressTrackerData = async (year, month) => {
  //   try {
  //     const response = await axios.get(
  //       `/progressTracker?year=${year}&month=${month}`
  //     );
  //     setProgressData(response.data);
  //     setEncouragingWords(
  //       getEncouragingWords(
  //         response.data.relativeCompletionPercentage,
  //         daysPassed,
  //         response.data.uploadedDays
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error fetching Available Date Time Slots:", error);
  //     // Handle the error as needed
  //   }
  // };

  const fetchVideoData = useCallback(async (year, month) => {
    try {
      const response = await axios.get(
        `/videos/getVideo?year=${year}&month=${month}`
      );
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  }, []); // Include dependencies if any variables inside useCallback are expected to change

  const fetchProgressTrackerData = useCallback(
    async (year, month) => {
      try {
        const response = await axios.get(
          `/progressTracker?year=${year}&month=${month}`
        );
        setProgressData(response.data);
        setEncouragingWords(
          getEncouragingWords(
            response.data.relativeCompletionPercentage,
            daysPassed,
            response.data.uploadedDays
          )
        );
      } catch (error) {
        console.error("Error fetching progress tracker data:", error);
      }
    },
    [daysPassed]
  ); // 'daysPassed' is used here so it needs to be a dependency

  const handleMonthChange = (newDate) => {
    setCalendarViewDate(newDate);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    fetchVideoData(year, month);
    fetchProgressTrackerData(year, month);
  };

  // useEffect(() => {
  //   const year = currentDate.getFullYear();
  //   const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  //   fetchVideoData(year, month);
  //   fetchProgressTrackerData(year, month);
  // }, [currentDate]);

  useEffect(() => {
    const currentDate = new Date(); // Now defined inside useEffect
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchVideoData(year, month);
    fetchProgressTrackerData(year, month);
  }, [fetchVideoData, fetchProgressTrackerData]);
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
          Progress Tracker
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SemiCircleProgressBar
            progress={
              progressData ? progressData.relativeCompletionPercentage : 0
            }
            size={500}
          />
          <Typography variant="h6" sx={{ fontWeight: "medium", mt: -6 }}>
            {progressData ? progressData.uploadedDays : 0}/
            {progressData ? progressData.totalDaysInMonth : 0} videos submitted
            in {format(calendarViewDate, "MMMM yyyy")}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              mb: 4,
              color: getProgressColor(
                progressData ? progressData.relativeCompletionPercentage : 0
              ),
              fontWeight: "bold",
            }}
          >
            {encouragingWords}
          </Typography>
        </Box>
        {/* <DataViewer data={videoData} variableName="videoData for the month"></DataViewer> */}
        {/* <DataViewer data={progressData} variableName="progressTracker"></DataViewer> */}

        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "60vh" }}
          views={{ month: true, agenda: true }}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: (props) => (
              <CustomToolbar {...props} onMonthChange={handleMonthChange} />
            ),
            event: Event,
          }}
        />
        <Legend />
      </Paper>
    </Container>
  );
}
