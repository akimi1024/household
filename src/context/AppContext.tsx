import { createContext, ReactNode, useContext, useState } from "react";
import { Transaction } from "../types";

interface AppContextType {
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({children}: {children: ReactNode}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <AppContext.Provider value={{transactions, setTransactions}}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if(!context) {
    // contextがundefinedの場合の処理
    throw new Error("グローバルなデータはプロバイダーの中で取得してください")
  }
  return context
}