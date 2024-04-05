import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "./../../components/LineChart";

const Line = () => {
  return (
    <Box>
      <Header title="Simple Line Chart" subtitle="Example Simple Line Chart" />
      <Box height="75vh" sx={{ direction: "ltr" }}>
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
