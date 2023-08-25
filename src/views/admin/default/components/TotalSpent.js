// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
// Custom components
import Card from "components/card/Card.js"
import moment from "moment"
import axios from "axios"
import LineChart from "components/charts/LineChart"
import React, { useEffect, useState } from "react"
import { IoCheckmarkCircle } from "react-icons/io5"
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md"
// Assets
import { RiArrowUpSFill } from "react-icons/ri"
import { lineChartOptionsTotalSpent } from "variables/charts"

export default function TotalSpent(props) {
  const { ...rest } = props
  const [data, setData] = useState([])
  const [dataFetched, setDataFetched] = useState(false)
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
  }, [setData, setDataFetched])
  // Chakra Color Mode

  // Function to calculate total price for each month

  const calculateMonthlyTotal = () => {
    const tempMonthlyTotal = {}

    data.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          const timestamp = moment(order.timestamp, "DD/MM/YYYY, HH:mm:ss")
          const month = timestamp.format("MMMM YYYY") // Format: "Month Year"
          const totalPrice = order.Price

          if (tempMonthlyTotal[month]) {
            tempMonthlyTotal[month] += totalPrice
          } else {
            tempMonthlyTotal[month] = totalPrice
          }
        }
      })
    })
    return tempMonthlyTotal
  }
  const MonthTotalPrice = calculateMonthlyTotal()

  // const CalculateMonthlyTotal = calculateMonthlyTotal()
  // const lineChartDataTotalSpent = [
  //   {
  //     name: "Revenue",
  //     data: [45, 4, 5, 54],
  //   },
  //   {
  //     name: "Profit",
  //     data: [45, 4, 5, 54],
  //   },
  // ]
  const lineChartDataTotalSpent = [
    {
      name: "dsfdfdf",
      data: Object.values(MonthTotalPrice),
    },
  ]
  console.log(lineChartDataTotalSpent)
  const textColor = useColorModeValue("secondaryGray.900", "white")
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white")
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100")
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
  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px"
          >
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me="4px"
            />
            This month
          </Button>
          <Button
            ms="auto"
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
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" me="20px" mt="28px">
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
          >
            {`£${props.calculateTotalPrice()}`}
          </Text>
          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              me="12px"
            >
              Total Spent
            </Text>
            <Flex align="center">
              <Icon as={RiArrowUpSFill} color="green.500" me="2px" mt="2px" />
              <Text color="green.500" fontSize="sm" fontWeight="700">
                {`+${props.persenage}%`}
              </Text>
            </Flex>
          </Flex>

          <Flex align="center">
            <Icon as={IoCheckmarkCircle} color="green.500" me="4px" />
            <Text color="green.500" fontSize="md" fontWeight="700">
              On track
            </Text>
          </Flex>
        </Flex>
        <Box minH="260px" minW="75%" mt="auto">
          {dataFetched ? (
            <LineChart
              chartData={lineChartDataTotalSpent}
              chartOptions={lineChartOptionsTotalSpent}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </Box>
      </Flex>
    </Card>
  )
}
