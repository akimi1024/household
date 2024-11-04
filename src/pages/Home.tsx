import { Box } from '@mui/material'
import React from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionForm from '../components/TransactionForm'
import TransactionMenu from '../components/TransactionMenu'
import { Transaction } from '../types'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Home = ({monthlyTransactions, setCurrentMonth}: HomeProps ) => {
  return (
    <Box sx={{display: "Flex"}}>
      {/* 左側のコンテンツ */}
      <Box sx={{flexGrow: 1}}>
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calender monthlyTransactions={monthlyTransactions} setCurrentMonth={setCurrentMonth}/>
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  )
}

export default Home