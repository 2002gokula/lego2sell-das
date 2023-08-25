import {
  Button,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import exportFromJSON from "export-from-json"
import logoWhite from "assets/img/layout/logoWhite.png"
import React from "react"

export default function SidebarDocs() {
  const bgColor = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
  const borderColor = useColorModeValue("white", "navy.800")

  return (
    <div className="mb-8 -ml-7 flex items-center justify-center flex-col">
      <div className="py-6">
        <a
          href="https://api.lego2sell.com/export/csv/alldata1"
          className="bg-blue-500 text-base font-medium px-6 py-3 rounded-full"
        >
          Download Alldata CSV
        </a>
      </div>
      <div className="py-6">
        <a
          href="https://api.lego2sell.com/export/csv/order"
          className="bg-blue-500 text-base font-medium px-6 py-3 rounded-full"
        >
          Download Order CSV
        </a>
      </div>
      <div className="py-6">
        <a
          href="https://api.lego2sell.com/export/csv/mydetails"
          className="bg-blue-500 text-base font-medium px-6 py-3 rounded-full"
        >
          Download details CSV
        </a>
      </div>
    </div>
  )
}
