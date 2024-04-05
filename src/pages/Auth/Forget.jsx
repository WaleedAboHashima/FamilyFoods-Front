import { useTheme } from "@emotion/react";
import { Box, Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "./../../theme";
// Icons
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AdminForget } from './../../apis/Auth/ForgetPassword';
import { useNavigate } from "react-router-dom";
import  Cookies  from 'universal-cookie';
const Forgot = () => {
  // Variables
  const theme = useTheme();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const ForgetState = useSelector(state => state.forget)
  // Functions
  const handleForm = () => {
    dispatch(AdminForget({ email }))
  };
  const handleForgetPassword = () => {
    setError("")
    if (ForgetState.status === 200) {
      cookies.set("email", email, {
        maxAge: 60 * 10
      })
      navigator("/reset");
    }
    else if (ForgetState.status === 404) {
      setError("Email Not Found.")
    }
  }

  useEffect(() => {
    handleForgetPassword();
  }, [ForgetState.status])
  return (
    <Box
      display="flex"
      alignItems="center"
      height="100vh"
      width="100vw"
      justifyContent="center"
    >
      <Box
        backgroundColor={colors.whiteAccent[900]}
        p="10px 10px 10px 10px"
        width="30%"
      >
        <Box textAlign="right">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Box width="100%" height="auto" textAlign="center">
            <img src="../../assets/logo.png" width="50%" alt="logo" />
          </Box>
          <Formik onSubmit={handleForm} initialValues={{ email: "" }}>
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <motion.form
                initial={{ opacity: 0, transition: { duration: 0.5 } }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                onSubmit={handleSubmit}
                style={{ margin: "20% 0", width: "100%"}}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  alignItems="center"
                  gap="20px"
                >
                  <TextField
                    autoFocus
                    variant="outlined"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setEmail(e.target.value)}
                    value={values.email}
                    name="email"
                    required
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ width: "75%" }}
                  />
                  <Button
                    type="submit"
                    variant="filled"
                    sx={{
                      backgroundColor: "#307a59",
                      width: "75%",
                      padding: "10px",
                    }}
                    // onClick={() => console.log("Clicked")}
                  >
                    {ForgetState.loading === true ? <CircularProgress sx={{color: 'white'}} size={21}/> : "Submit"}
                  </Button>
                  <Typography variant="h3">{error}</Typography>
                </Box>
              </motion.form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Forgot;
