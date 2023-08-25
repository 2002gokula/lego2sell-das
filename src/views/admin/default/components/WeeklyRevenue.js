// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Card from "components/card/Card.js"
// Custom components
import CanvasJSReact from "@canvasjs/react-charts"
import axios from "axios"
import BarChart from "components/charts/BarChart"
import React, { useState, useEffect } from "react"

import { MdBarChart } from "react-icons/md"
import { barChartOptionsConsumption } from "variables/charts"

var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

export default function WeeklyRevenue(props) {
  const { ...rest } = props

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const iconColor = useColorModeValue("brand.500", "white")
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100")
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  )
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  )
  const [data, setData] = useState([])
  const [dataFetched, setDataFetched] = useState(false)
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    )

    // Handle special case for the first week of the year
    if (firstDayOfYear.getDay() === 0) {
      return weekNumber + 1
    }

    return weekNumber
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.lego2sell.com/data") // Replace with your server URL
        setData(response.data)
        setDataFetched(true) // Add this line
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [setDataFetched, setData])

  const WeeklyPrice = () => {
    const weeklyPrices = {}

    data.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          const orderTimestamp = order.timestamp
          const [datePart, timePart] = orderTimestamp.split(", ")
          const [day, month, year] = datePart.split("/")
          const [hour, minute, second] = timePart.split(":")
          const orderDate = new Date(year, month - 1, day, hour, minute, second)
          const weekNumber = getWeekNumber(orderDate)

          if (weeklyPrices[weekNumber]) {
            weeklyPrices[weekNumber] += order.Price
          } else {
            weeklyPrices[weekNumber] = order.Price
          }
        }
      })
    })

    return weeklyPrices
  }
  const weeklyPrices = WeeklyPrice()
  const categoriesWithWeek = Object.keys(weeklyPrices).map((weekNumber) =>
    parseInt(weekNumber)
  )

  const barChartDataConsumption = [
    {
      name: "Weekly Revenue",
      data: Object.values(weeklyPrices),
    },
    // {
    //   name: "Number of Week",
    //   data: Object.keys(weeklyPrices),
    // },
  ]
  const barChartOptionsConsumption = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: Object.keys(weeklyPrices),
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      color: "black",
      labels: {
        show: false,
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
    },

    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
      show: true,
      yaxis: {
        lines: {
          show: false,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    },
    legend: {
      show: false,
    },
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "20px",
      },
    },
  }

  // console.log(barChartDataConsumption)
  // const [options, setOptions] = useState({
  //   animationEnabled: true,
  //   exportEnabled: true,
  //   theme: "dark2", //"light1", "dark1", "dark2"

  //   axisY: {
  //     includeZero: true,
  //   },
  //   data: [
  //     {
  //       type: "column", //change type to bar, line, area, pie, etc
  //       //indexLabel: "{y}", //Shows y value on all Data Points
  //       indexLabelFontColor: "#5A5757",
  //       indexLabelPlacement: "outside",
  //       dataPoints: [
  //         { x: 10, y: 71 },
  //         { x: 20, y: 55 },
  //         { x: 30, y: 50 },
  //         { x: 40, y: 65 },
  //         { x: 50, y: 71 },
  //         { x: 60, y: 68 },
  //         { x: 70, y: 38 },
  //         { x: 80, y: 92, indexLabel: "Highest" },
  //         { x: 90, y: 54 },
  //         { x: 100, y: 60 },
  //         { x: 110, y: 21 },
  //         { x: 120, y: 49 },
  //         { x: 130, y: 36 },
  //       ],
  //     },
  //   ],
  // })
  // const dailyPrices1 = [
  //   weeklyPrices.map((value) => {
  //     return {
  //       dayNumber: value.dayNumber,
  //       totalPrice: value.totalPrice,
  //       dayOfWeek: value.dayOfWeek,
  //     }
  //   }),
  // ]
  console.log(weeklyPrices)
  // useEffect(() => {
  //   // Update dataPoints array with dailyPrices values
  //   const updatedData = options.data.map((dataItem) => ({
  //     ...dataItem,
  //     dataPoints: dailyPrices1[0].map((dayPrice) => ({
  //       x: dayPrice.dayNumber,
  //       y: dayPrice.totalPrice,
  //       indexLabel: dayPrice.dayOfWeek,
  //     })),
  //   }))

  //   setOptions({
  //     ...options,
  //     data: updatedData,
  //   })
  // }, [])
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Weekly Revenue
        </Text>
        <Button
          align="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
        </Button>
      </Flex>

      <Box h="240px" mt="auto">
        {dataFetched ? (
          <BarChart
            chartData={barChartDataConsumption}
            chartOptions={barChartOptionsConsumption}
          />
        ) : (
          <Text>Loading...</Text>
        )}
        {/* <CanvasJSChart options={options} /> */}
      </Box>
    </Card>
  )
}
