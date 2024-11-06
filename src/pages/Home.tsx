import { Box } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionForm from '../components/TransactionForm'
import TransactionMenu from '../components/TransactionMenu'
import { Transaction } from '../types'
import { format } from 'date-fns'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Home = ({monthlyTransactions, setCurrentMonth}: HomeProps ) => {
  const today = format(new Date(), "yyyy-MM-dd")
  const [currentDay, setCurrentDay] = useState(today)

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay
  })

  return (
    <Box sx={{display: "Flex"}}>
      {/* 左側のコンテンツ */}
      <Box sx={{flexGrow: 1}}>
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today = {today}/>
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu dailyTransactions={dailyTransactions} currentDay={currentDay}/>
        <TransactionForm />
      </Box>
    </Box>
  )
}

export default Home