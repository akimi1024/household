import { Box } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionForm from '../components/TransactionForm'
import TransactionMenu from '../components/TransactionMenu'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/Schema'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  onSaveTransaction: (transaction: Schema) => Promise<void>,
  selectedTransaction: Transaction | null,
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
}

const Home = ({monthlyTransactions, setCurrentMonth, onSaveTransaction, selectedTransaction, setSelectedTransaction}: HomeProps ) => {
  const today = format(new Date(), "yyyy-MM-dd")
  const [currentDay, setCurrentDay] = useState(today)
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay
  })

  // 閉じるボタン押下判定
  const CloseForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
  }

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    console.log(transaction)
    setIsEntryDrawerOpen(true)
    setSelectedTransaction(transaction)
  }

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
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          handleAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}/>
        <TransactionForm
          isEntryDrawerOpen={isEntryDrawerOpen}
          onCloseForm={CloseForm}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}/>
      </Box>
    </Box>
  )
}

export default Home