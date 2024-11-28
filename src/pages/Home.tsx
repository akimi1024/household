import { Box } from '@mui/material'
import React, { useMemo, useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionForm from '../components/TransactionForm'
import TransactionMenu from '../components/TransactionMenu'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { DateClickArg } from '@fullcalendar/interaction'
import { useAppContext } from '../context/AppContext'
import useMonthlyTransactions from '../hooks/useMonthlyTransactions'

// interface HomeProps {
//   monthlyTransactions: Transaction[],
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
//   onSaveTransaction: (transaction: Schema) => Promise<void>,
//   onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>,
//   onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>
// }

const Home = () =>
  // monthlyTransactions,
  // setCurrentMonth,
  // onSaveTransaction,
  // onDeleteTransaction,
  // onUpdateTransaction
// }: HomeProps) =>
{
  const {isMobile} = useAppContext()
  const monthlyTransactions = useMonthlyTransactions()

  const today = format(new Date(), "yyyy-MM-dd")
  const [currentDay, setCurrentDay] = useState(today)
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // const theme = useTheme()

  // const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  // 1日分のデータを取得
  const dailyTransactions = useMemo(() => {
    return monthlyTransactions.filter((transaction) =>
      transaction.date === currentDay
    )
  }, [monthlyTransactions, currentDay])

  // 閉じるボタン押下判定
  const CloseForm = () => {
    setSelectedTransaction(null)

    if (isMobile) {
      setIsDialogOpen(!isDialogOpen)
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }
  }

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true)
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null)
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen)
      }
    }
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    if(isMobile){
      setIsDialogOpen(true)
    }else{
      setIsEntryDrawerOpen(true)
    }
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
        <MonthlySummary />
        <Calender
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
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          isEntryDrawerOpen={isEntryDrawerOpen}
          onCloseForm={CloseForm}
          currentDay={currentDay}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  )
}

export default Home