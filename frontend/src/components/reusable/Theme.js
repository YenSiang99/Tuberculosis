import { createTheme, responsiveFontSizes,} from "@mui/material/styles";

let theme = createTheme({
    palette: {
        primary: {
            main: "#0046c0",
        },
    },
    });
theme = responsiveFontSizes(theme);

export default theme;
