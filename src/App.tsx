import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/Schema';

function App() {

  // FireStoreエラーかどうかを判定する型ガード
  function isFireStoreError(err: unknown): err is { code: string, message: string } {
    return typeof err === "object" && err !== null && "code" in err
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));

        const transactionData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });

        setTransactions(transactionData)
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreエラー: ", err)
        } else {
          console.error("一般的なエラー: ", err)
        }
      }
    }

    fetchTransactions();
  }, [])

  // 一月分のデータのみ抽出
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  })

  // 取引データを保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    console.log(transaction)
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Transactions"), transaction)
      console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction
      }as Transaction

      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction
      ])
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreエラー: ", err)
      } else {
        console.error("一般的なエラー: ", err)
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home
              monthlyTransactions={monthlyTransactions}
              setCurrentMonth={setCurrentMonth}
              onSaveTransaction={handleSaveTransaction}
              />}
            />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
