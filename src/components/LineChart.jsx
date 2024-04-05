import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../theme";
import { useTheme } from "@emotion/react";
import { mockLineData as data } from "../data/usersData";

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.colors);
  return (
    <ResponsiveLine
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.primary[500],
            },
          },
          legend: {
            text: {
              fill: colors.primary[900],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[500],
              strokeWidth: 1,
            },
            text: {
              fill: colors.whiteAccent[300],
            },
          },
        },
        legends: {
          text: {
            fill: colors.primary[500],
          },
        },
        tooltip: {
          container: {
            background: theme.palette.mode === "dark" ? "black" : "white",
            color: theme.palette.mode === "dark" ? colors.primary[900] : "black",

          }
        }
      }}
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      // isInteractive={false}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
