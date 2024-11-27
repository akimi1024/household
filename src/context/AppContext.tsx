import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { Transaction } from '../types/index';
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Schema } from '../validations/Schema';

interface AppContextType {
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  onSaveTransaction: (transaction: Schema) => Promise<void>
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  // 型ガード
  function isFireStoreError(err: unknown): err is { code: string, message: string } {
    return typeof err === "object" && err !== null && "code" in err
  }

  /**
 * 取引データ保存処理
 * @param transaction
 */
  const onSaveTransaction = async (transaction: Schema) => {
    console.log(transaction)
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Transactions"), transaction)
      console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction
      } as Transaction

      // 保存したデータをロードせずに表示するように変更
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

  /**
   * データ削除処理
   * @param transactionIds
   */
  const onDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds]
      for (const id of idsToDelete) {
        // firestoreのデータを削除
        await deleteDoc(doc(db, "Transactions", id));
      }

      const filteredTransaction = transactions.filter((transaction) => !idsToDelete.includes(transaction.id))
      setTransactions(filteredTransaction)
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreエラー: ", err)
      } else {
        console.error("一般的なエラー: ", err)
      }
    }
  }

  /**
 * データ更新処理
 * @param transaction
 * @param transactionId
 */
  const onUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
      const docRef = doc(db, "Transactions", transactionId);

      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef, transaction);

      // フロント更新
      const updatedTransactions = transactions.map((t) => t.id === transactionId ? { ...t, ...transaction } : t) as Transaction[]
      setTransactions(updatedTransactions)
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreエラー: ", err)
      } else {
        console.error("一般的なエラー: ", err)
      }
    }
  }

  return (
    <AppContext.Provider
    value={{
      transactions,
      setTransactions,
      currentMonth,
      setCurrentMonth,
      isLoading,
      setIsLoading,
      isMobile,
      onSaveTransaction,
      onDeleteTransaction,
      onUpdateTransaction
      }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    // contextがundefinedの場合の処理
    throw new Error("グローバルなデータはプロバイダーの中で取得してください")
  }
  return context
}