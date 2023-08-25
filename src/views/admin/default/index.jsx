// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react"
// Assets
import axios from "axios"
import moment from "moment"
import Usa from "assets/img/dashboards/usa.png"
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar"
import MiniStatistics from "components/card/MiniStatistics"
import IconBox from "components/icons/IconBox"
import React, { useEffect, useState } from "react"
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdCurrencyPound,
} from "react-icons/md"
import CheckTable from "views/admin/default/components/CheckTable"
import ComplexTable from "views/admin/default/components/ComplexTable"
import DailyTraffic from "views/admin/default/components/DailyTraffic"
import PieCard from "views/admin/default/components/PieCard"
import Tasks from "views/admin/default/components/Tasks"
import TotalSpent from "views/admin/default/components/TotalSpent"
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue"
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData"
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json"
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json"
import ReactApexChart from "react-apexcharts"
import { lineChartOptionsTotalSpent } from "variables/charts"
import LineChart from "components/charts/LineAreaChart"
import Chartpaid from "./components/Chartpaid"

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white")
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100")
  const [data, setData] = useState([])
  const VisitorUser = data.map((value) => value.data)
  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      type: "datetime", // Specify that the x-axis values are dates
    },
    // Other chart options...
  })

  const [chartData, setChartData] = useState([
    {
      name: "Item 1",
      data: [
        [new Date("2023-08-01").getTime(), 10], // [timestamp, value]
        [new Date("2023-08-02").getTime(), 20],
        // More data points...
      ],
    },
    {
      name: "Item 2",
      data: [
        [new Date("2023-08-01").getTime(), 5],
        [new Date("2023-08-02").getTime(), 15],
        // More data points...
      ],
    },
    // More data series...
  ])
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
  }, [setData])
  let pendingOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Pending") {
        pendingOrdersCount++
      }
    })
  })
  let paidOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Paid") {
        paidOrdersCount++
      }
    })
  })
  let acceptedOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Accepted") {
        acceptedOrdersCount++
      }
    })
  })
  let receivedOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Received") {
        receivedOrdersCount++
      }
    })
  })
  let rejectedOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Rejected") {
        rejectedOrdersCount++
      }
    })
  })
  const calculateTotalPrice = () => {
    let total = 0
    data.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          total += order.Price
        }
      })
    })
    return total.toFixed(2)
  }
  let checkingOrdersCount = 0

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status === "Checking") {
        checkingOrdersCount++
      }
    })
  })
  const calculateSpendThisMonth = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Months are zero-based, so we add 1 to get the current month.

    let totalSpendThisMonth = 0
    data.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          const orderDate = new Date(order.timestamp)
          const orderMonth = orderDate.getMonth() + 1
          if (orderMonth === currentMonth) {
            totalSpendThisMonth += order.Price
          }
        }
      })
    })
    return totalSpendThisMonth
  }

  const calculateTotalOrders = () => {
    let totalOrders = 0
    data?.forEach((user) => {
      totalOrders += user.Order?.length
    })
    return totalOrders
  }
  const getPreviousMonthTotalPrice = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()

    // Set the currentDate to the first day of the current month
    currentDate.setDate(1)

    // Move back one day to get the last day of the previous month
    currentDate.setDate(0)

    const lastDayOfPreviousMonth = currentDate.getDate()
    const previousMonthOrders = []

    data.forEach((user) => {
      user.Order.forEach((order) => {
        const orderDate = new Date(order.timestamp)
        const orderMonth = orderDate.getMonth()
        const orderDay = orderDate.getDate()

        if (
          orderMonth === currentMonth - 1 &&
          orderDay <= lastDayOfPreviousMonth &&
          order.Status === "Paid"
        ) {
          previousMonthOrders.push(order)
        }
      })
    })

    return calculateTotalPrice(previousMonthOrders)
  }

  const calculateTotalOrder = () => {
    let total = 0
    data.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          total += order
        }
      })
    })
    return total
  }

  const getPreviousMonthTotalNumberOfOrders = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()

    // Set the currentDate to the first day of the current month
    currentDate.setDate(1)

    // Move back one day to get the last day of the previous month
    currentDate.setDate(0)

    const lastDayOfPreviousMonth = currentDate.getDate()
    const previousMonthOrders = []

    data.forEach((user) => {
      user.Order.forEach((order) => {
        const orderDate = new Date(order.timestamp)
        const orderMonth = orderDate.getMonth()
        const orderDay = orderDate.getDate()

        if (
          orderMonth === currentMonth - 1 &&
          orderDay <= lastDayOfPreviousMonth &&
          order.Status === "Paid"
        ) {
          previousMonthOrders.push(order)
        }
      })
    })

    return calculateTotalOrder(previousMonthOrders)
  }

  // Calculate the total price for the current month
  const currentMonthTotal = calculateTotalPrice(
    data.flatMap((user) => user.Order)
  )

  // Get the total price for the previous month
  const previousMonthTotal = getPreviousMonthTotalPrice()

  // Function to calculate the percentage increase
  const calculatePercentageIncrease = (
    currentMonthTotal,
    previousMonthTotal
  ) => {
    if (previousMonthTotal === 0) return 0
    return ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
  }
  console.log(calculateTotalOrder(), "kogokula")
  // // Calculate the total revenue and profit for each month
  // const calculateMonthlyRevenueAndProfit = () => {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
  //   const monthlyRevenue = months.map((month) => ({ name: month, data1: 0 }))
  //   const monthlyProfit = months.map((month) => ({ name: month, data1: 0 }))

  //   data.forEach((user) => {
  //     user.Order.forEach((order) => {
  //       if (order.Status === "Paid") {
  //         const orderDate = new Date(order.timestamp)
  //         const orderMonth = orderDate.getMonth()
  //         const orderPrice = order.Price

  //         monthlyRevenue[orderMonth].data1 += orderPrice
  //         // Assuming the profit is 20% of the revenue (you can modify this as needed)
  //         monthlyProfit[orderMonth].data1 += orderPrice * 0.2
  //       }
  //     })
  //   })

  //   return { monthlyRevenue, monthlyProfit }
  // }

  const lineChartDataTotalSpent = [
    {
      name: "Revenue",
      data: [45, 4, 5, 54],
    },
    {
      name: "Profit",
      data: [45, 4, 5, 54],
    },
  ]

  // // Get the calculated revenue and profit data
  // const { monthlyRevenue, monthlyProfit } = calculateMonthlyRevenueAndProfit()

  // Update the lineChartDataTotalSpent array with the calculated revenue and profit data

  // Group orders by week number and calculate the weekly and total revenue
  const itemStats = {}

  // Loop through the user data
  data.forEach((user) => {
    user.Order.forEach((order) => {
      const itemName = order.ProductName
      const itemId = order.ProductId
      const itemPrice = order.Price
      if (itemStats[itemName]) {
        itemStats[itemName].count++
        itemStats[itemName].totalPrice += itemPrice
        itemStats[itemName].ids.push(itemId)
      } else {
        itemStats[itemName] = { count: 1, totalPrice: itemPrice, ids: [itemId] }
      }
    })
  })

  // Convert the item statistics object into an array of objects
  const sortedItems = Object.keys(itemStats).map((item) => ({
    name: item,
    count: itemStats[item].count,
    totalPrice: itemStats[item].totalPrice,
    itemIds: itemStats[item].ids,
  }))

  // Sort the items by count in descending order
  sortedItems.sort((a, b) => b.count - a.count)

  // Get the top 10 items
  const top10Items = sortedItems.slice(0, 10)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Total Earnings"
          value={`£ ${calculateTotalPrice()}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdCurrencyPound}
                  color={brandColor}
                />
              }
            />
          }
          name="Spend this month"
          value={`£ ${calculateSpendThisMonth()}`}
        />
        {/* <MiniStatistics growth="+23%" name="Sales" value="$574.34" /> */}
        <MiniStatistics
          endContent={
            <Flex me="-16px" mt="10px">
              <FormLabel htmlFor="balance">
                <Avatar src={Usa} />
              </FormLabel>
            </Flex>
          }
          name="Your balance"
          value={`£ ${calculateTotalPrice()}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="Orders"
          value={calculateTotalOrders()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Total Orders"
          value={calculateTotalOrders()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Price Search"
          value={VisitorUser.length}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Pending"
          value={pendingOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Paid"
          value={paidOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Checking"
          value={checkingOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Rejected"
          value={rejectedOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Received"
          value={receivedOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Order Accepted"
          value={acceptedOrdersCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Customer Accounts"
          value={data.length}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent
          persenage={calculatePercentageIncrease(
            currentMonthTotal,
            previousMonthTotal
          ).toFixed(2)}
          calculateTotalPrice={calculateTotalPrice}
        />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
        <DailyTraffic />
        {/* <PieCard /> */}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <MiniCalendar h="100%" minW="70%" selectRange={false} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {/* <Tasks /> */}
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <Chartpaid category="Paid" title="Daily Paid Orders Traffic" />
        <Chartpaid category="Rejected" title="Daily Rejected Orders Traffic" />
        <Chartpaid category="Accepted" title="Daily Accepted Orders Traffic" />
        <Chartpaid category="Pending" title="Daily Pending Orders Traffic" />
        <Chartpaid category="Received" title="Daily Received Orders Traffic" />
        <Chartpaid category="Checking" title="Daily Checking Orders Traffic" />
      </SimpleGrid>

      <div className="">
        <h1 className="text-2xl font-bold py-4 ">TOP 10 Items</h1>
        {sortedItems.map((value) => {
          return (
            <div className="my-6">
              <div className="flex lg:flex-row flex-col items-center py-6 border rounded-2xl  px-6 justify-between">
                <div className="flex lg:flex-row flex-col items-center gap-6">
                  {/* <img
                    src=""
                    className="w-44 object-contain  border rounded-lg px-4 border-gray-300 h-32"
                    alt=""
                  /> */}
                  <h3 className="text-lg font-semibold">
                    {`   ${value.name} 
                    ${value.itemIds[0]}`}
                  </h3>
                </div>
                <h4 className="text-lg font-semibold">
                  {" "}
                  Total Price £ {`${value.totalPrice.toFixed(2)}`}
                </h4>
                <div className="flex items-center gap-8 justify-center text-blue-500 font-bold">
                  <p className="font-normal">How many Order</p>
                  <h2 className="bg-blue-500 w-8 h-8 text-center flex items-center justify-center text-white rounded-xl">
                    {value.count}
                  </h2>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Box>
  )
}
