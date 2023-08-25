import React, { useState, useEffect } from "react"

// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import BarChart from "components/charts/BarChart"
import axios from "axios"
// Custom components
import Card from "components/card/Card.js"
import { barChartOptionsDailyTraffic } from "variables/charts"
import CanvasJSReact from "@canvasjs/react-charts"

var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart
// Assets
// import { RiArrowUpSFill } from "react-icons/ri"

export default function Chartpaid(props) {
  const { ...rest } = props
  const [data, setData] = useState([])
  const [dailyTrafficPercentage, setDailyTrafficPercentage] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.lego2sell.com/data") // Replace with your server URL
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  // const barChartDataDailyTraffic = [
  //   {
  //     name: "Weekly Orders",
  //     data: weeklyOrderCount,
  //   },
  // ]
  const dailyPrices = []

  // Calculate daily total prices
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === props.category) {
        const orderTimestamp = order.timestamp
        const [datePart, timePart] = orderTimestamp.split(", ")
        const [day, month, year] = datePart.split("/")
        const [hour, minute, second] = timePart.split(":")
        const orderDate = new Date(year, month - 1, day, hour, minute, second)
        const dayNumber = orderDate.getDate()
        const dayOfWeek = orderDate.toLocaleString("en-US", { weekday: "long" })

        // Check if the day already exists in the dailyPrices array
        const existingDayIndex = dailyPrices.findIndex(
          (item) => item.dayNumber === dayNumber
        )

        if (existingDayIndex !== -1) {
          // If the day already exists, add the price to its total
          dailyPrices[existingDayIndex].totalPrice += user.Order.length
        } else {
          // If the day doesn't exist, add a new entry for the day
          dailyPrices.push({
            dayNumber: dayNumber,
            totalPrice: user.Order.length,
            dayOfWeek: dayOfWeek,
          })
        }
      }
    })
  })
  console.log(dailyPrices, "ko999999")
  // Extract the daily total prices as an array

  const barChartDataDailyTraffic = [
    {
      name: "Daily Traffic",
      data: Object.values(dailyPrices).map((item) => item.totalPrice),
    },
  ]
  // console.log(barChartDataDailyTraffic)
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const getDefaultOptions = () => ({
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1", //"light1", "dark1", "dark2"
    axisY: {
      includeZero: true,
    },
    data: [
      {
        type: "column",
        indexLabelFontColor: "#000",
        indexLabelPlacement: "inside",
        dataPoints: [],
      },
    ],
  })

  const [options, setOptions] = useState(getDefaultOptions)

  const dailyPrices1 = [
    dailyPrices.map((value) => {
      return {
        dayNumber: value.dayNumber,
        totalPrice: value.totalPrice,
        dayOfWeek: value.dayOfWeek,
      }
    }),
  ]
  useEffect(() => {
    // Update dataPoints array with dailyPrices values
    const updatedData = options.data.map((dataItem) => ({
      ...dataItem,
      dataPoints: dailyPrices1[0].map((dayPrice) => ({
        x: dayPrice.dayNumber,
        y: dayPrice.totalPrice,
        indexLabel: dayPrice.dayOfWeek,
      })),
    }))

    setOptions({
      ...options,
      data: updatedData,
    })
  }, [options])
  useEffect(() => {
    // Calculate percentage change in daily traffic
    if (dailyPrices.length >= 2) {
      const todayTraffic = dailyPrices[dailyPrices.length - 1].totalPrice
      const yesterdayTraffic = dailyPrices[dailyPrices.length - 2].totalPrice
      const percentageChange =
        ((todayTraffic - yesterdayTraffic) / yesterdayTraffic) * 100
      setDailyTrafficPercentage(percentageChange)
    }
  }, [dailyPrices])

  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex justify="space-between" align="start" px="10px" pt="5px">
        <Flex flexDirection="column" align="start" me="20px">
          <Flex w="100%">
            <Text
              me="auto"
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
            >
              {props.title}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box h="240px" style={{ height: "430px", paddingTop: "10px" }} mt="auto">
        {/* <BarChart
          chartData={barChartDataDailyTraffic}
          chartOptions={barChartOptionsDailyTraffic}
        /> */}
        <CanvasJSChart options={options} />
      </Box>
    </Card>
  )
}
