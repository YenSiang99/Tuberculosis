import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
      >
        {i18n.language.toUpperCase()}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage("ms")}>Malay</MenuItem>
        {/* Add more language options as needed */}
      </Menu>
    </>
  );
};

export default LanguageSelector;
