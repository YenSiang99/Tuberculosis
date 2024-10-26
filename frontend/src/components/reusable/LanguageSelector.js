import React from "react";
import { useTranslation } from "react-i18next";
import { ButtonGroup, Button } from "@mui/material";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup
      variant="contained"
      size="small"
      sx={{
        "& .MuiButton-root": {
          minWidth: "40px", // Ensure buttons stay compact
          backgroundColor: "white",
          color: "#0046c0",
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
          "&.active": {
            backgroundColor: "#0046c0",
            color: "white",
            "&:hover": {
              backgroundColor: "#0046c0",
            },
          },
          // Make buttons slightly smaller on mobile
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "4px 8px", sm: "6px 12px" },
        },
      }}
    >
      <Button
        className={i18n.language === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        EN
      </Button>
      <Button
        className={i18n.language === "ms" ? "active" : ""}
        onClick={() => changeLanguage("ms")}
      >
        MS
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSelector;
