import { Box, Button } from "@mui/material";
import Header from "./../../components/Header";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeSettings } from "./../../apis/Info/AdminSettings";
import Cookies from "universal-cookie";
import * as yup from "yup";
const Settings = () => {
  const [email, setEmail] = useState();
  const [disabledName, setDisabledName] = useState(true);
  const [disabledEmail, setDisabledEmail] = useState(true);
  const [disabledPhone, setDisabledPhone] = useState(true);
  const [phone, setPhone] = useState();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const State = useSelector((state) => state.settings.status);
  const [username, setUsername] = useState();
  const FASTATE = useSelector((state) => state.FA);

  // Functions
  const handleChange = () => {
    dispatch(
      ChangeSettings({ email: email, phone: phone, username: username })
    );
  };

  const SubmissionData = () => {
    if (State === 200 && username) {
      cookies.set("_auth_verify", username);
      window.location.reload();
    } else if (State === 200) {
      console.log("Done");
      window.location.reload();
    }
    else {
      console.log("Error")
    }
  };

  useEffect(() => {
    SubmissionData();
  }, [State]);

  return (
    <Box m="40px">
      <Header title="Settings" subtitle="Change Admin Settings" />
      <Box marginTop="20px">
        <Box>
          <Formik
            initialValues={initialValues}
            onSubmit={handleChange}
            // validationSchema={validateSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={FASTATE.data.data ? `${FASTATE.data.data}` : ""}
                  alt=""
                />
                <Box display="flex" width="100%" m="10px">
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={values.name}
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setUsername(e.target.value)}
                    errors={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ width: "80%" }}
                    disabled={disabledName}
                  />
                  <Button
                    type="submit"
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledName ? "none" : "inlineBlock",
                    }}
                    variant="filled"
                  >
                    submit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledName ? "inlineBlock" : "none",
                    }}
                    variant="filled"
                    onClick={() => setDisabledName(false)}
                  >
                    edit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                    }}
                    variant="filled"
                    onClick={() => setDisabledName(true)}
                  >
                    cancel
                  </Button>
                </Box>
                <Box display="flex" width="100%" m="10px">
                  <TextField
                    sx={{ width: "80%" }}
                    fullWidth
                    label="Email"
                    name="email"
                    value={values.email}
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setEmail(e.target.value)}
                    errors={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    disabled={disabledEmail}
                  />
                  <Button
                    type="submit"
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledEmail ? "none" : "inlineBlock",
                    }}
                    variant="filled"
                  >
                    submit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledEmail ? "inlineBlock" : "none",
                    }}
                    variant="filled"
                    onClick={() => setDisabledEmail(false)}
                  >
                    edit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                    }}
                    variant="filled"
                    onClick={() => setDisabledEmail(true)}
                  >
                    cancel
                  </Button>
                </Box>
                <Box display="flex" width="100%" m="10px">
                  <TextField
                    sx={{ width: "80%" }}
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setPhone(e.target.value)}
                    errors={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    disabled={disabledPhone}
                  />
                  <Button
                    type="submit"
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledPhone ? "none" : "inlineBlock",
                    }}
                    variant="filled"
                  >
                    submit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                      display: disabledPhone ? "inlineBlock" : "none",
                    }}
                    variant="filled"
                    onClick={() => setDisabledPhone(false)}
                  >
                    edit
                  </Button>
                  <Button
                    sx={{
                      margin: "0 10px",
                      width: "10%",
                      backgroundColor: "#307a59",
                      padding: "10px",
                    }}
                    variant="filled"
                    onClick={() => setDisabledPhone(true)}
                  >
                    cancel
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

const initialValues = {
  name: "",
  email: "",
  phone: "",
};

const validateSchema = yup.object().shape({
  name: yup.string().required("Required Field."),
  email: yup.string().email().required("Required Field."),
});

export default Settings;
