// import React from "react";
// import { Grid, TextField, Typography, Box } from "@mui/material";

// const FillInTheBlanks = () => {
//   const questions = [
//     {
//       id: 1,
//       beforeBlank: "TB is typically spread through",
//       afterBlank: "from an infected person",
//       answer: "",
//     },
//     // Add more questions as needed
//   ];

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         backgroundColor: "background.paper",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//         borderRadius: 4,
//         p: 4,
//       }}
//     >
//       <Typography
//         variant="h6"
//         color="textPrimary"
//         gutterBottom
//         sx={{ fontWeight: "bold" }}
//       >
//         Login
//       </Typography>
//       <form onSubmit={handleLogin}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               fullWidth
//               variant="filled"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               fullWidth
//               variant="filled"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword} // Toggle the visibility
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid
//             container
//             item
//             xs={12}
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Grid item xs={6} style={{ textAlign: "left" }}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={rememberMe}
//                     onChange={handleRememberMeChange}
//                   />
//                 }
//                 label="Remember me"
//               />
//             </Grid>
//             <Grid item xs={6} style={{ textAlign: "right" }}>
//               <Link
//                 to="/forgot-password"
//                 style={{
//                   textDecoration: "none",
//                   color: theme.palette.primary.main,
//                 }}
//               >
//                 Forgot password?
//               </Link>
//             </Grid>
//           </Grid>
//           {/* Login Button */}
//           <Grid item xs={12}>
//             <Button type="submit" fullWidth variant="contained" color="primary">
//               Login
//             </Button>
//           </Grid>
//           {/* Register Link */}
//           <Grid item xs={12} style={{ textAlign: "center" }}>
//             <Typography variant="body1" sx={{ color: "black", mt: 2 }}>
//               Not a user yet?{" "}
//               <Link
//                 to="#"
//                 style={{
//                   textDecoration: "none",
//                   color: theme.palette.primary.main,
//                   fontWeight: "bold",
//                 }}
//                 onClick={handleRegister}
//               >
//                 Register
//               </Link>
//             </Typography>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default FillInTheBlanks;
