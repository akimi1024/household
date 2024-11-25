import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionForm from '../components/TransactionForm'
import TransactionMenu from '../components/TransactionMenu'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/Schema'
import { DateClickArg } from '@fullcalendar/interaction'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  onSaveTransaction: (transaction: Schema) => Promise<void>,
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>,
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>
}

const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd")
  const [currentDay, setCurrentDay] = useState(today)
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay
  })

  // 閉じるボタン押下判定
  const CloseForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
    setSelectedTransaction(null)
  }

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (selectedTransaction) {
      setSelectedTransaction(null)
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    console.log(transaction)
    setIsEntryDrawerOpen(true)
    setSelectedTransaction(transaction)
  }

  // モバイル用のDrawerを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false)
  }

  // 日付を選択した時の処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr)
    setIsMobileDrawerOpen(true)
  }

  return (
    <Box sx={{ display: "Flex" }}>
      {/* 左側のコンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          handleAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          isEntryDrawerOpen={isEntryDrawerOpen}
          onCloseForm={CloseForm}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      </Box>
    </Box>
  )
}

export default Home