import React from "react"
import { Box } from "zmp-ui"
import StatisticList from "./StatisticList"
import StatisticMain from "./StatisticMain"
import StatisticListForResident from "./StatisticListForResident"

const StatisticSection: React.FC<any> = () => {

    return (
        <Box>
            <Box px={3} pb={4}>
                <StatisticList />
                <StatisticListForResident />
                <StatisticMain />
            </Box>
        </Box>
    )
}

export default StatisticSection