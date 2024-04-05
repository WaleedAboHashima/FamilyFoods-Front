import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { useContext } from "react";
import { LanguageContext } from "../../language";

const Bar = () => {
    const context = useContext(LanguageContext);
    return (
        <Box m="20px">
            <Header title="Bar Chart" subtitle="Simple Bar Chart" />
            <Box height="75vh" sx={{direction: "ltr"}}>
                <BarChart />
            </Box>
        </Box>
    )
}

export default Bar;