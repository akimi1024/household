/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from "@mui/icons-material/Alarm"
import AddHomeIcon from "@mui/icons-material/AddHome"
import DiversityIcon from "@mui/icons-material/Diversity3"
import SportsTennisIcon from "@mui/icons-material/SportsTennis"
import TrainIcon from "@mui/icons-material/Train"
import WorkIcon from "@mui/icons-material/Work"
import AddBusinessIcon from "@mui/icons-material/AddBusiness"
import SavingsIcon from "@mui/icons-material/Savings"
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ExpenseCategory, IncomeCategory } from "../types";

interface TransactionFormProps {
  isEntryDrawerOpen: boolean,
  onCloseForm: () => void,
  currentDay: string
}

type incomeExpense = "income" | "expense"

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory
  icon: JSX.Element
}

const TransactionForm = ({ isEntryDrawerOpen, onCloseForm, currentDay }: TransactionFormProps) => {
  const formWidth = 320;

  const expenseCategories: CategoryItem[] = [
    { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
    { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
    { label: "交際費", icon: <DiversityIcon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
  ]

  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <WorkIcon fontSize="small" /> },
    { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
    { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
  ]

  const [categories, setCategories] = useState(expenseCategories)

  const { control, setValue, watch } = useForm({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: ""
    }
  })

  // 押下された収支タイプをセット
  const incomeExpenseToggle = (type: incomeExpense) => {
    setValue("type", type)
  }

  // 収支タイプを監視
  const currentType = watch("type")

  useEffect(() => {
    const newCategories = currentType === "expense" ? expenseCategories : incomeCategories
    setCategories(newCategories)
  }, [currentType])

  useEffect(() => {
    setValue("date", currentDay)
  }, [currentDay, setValue])

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create("right", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
        boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={field.value === "expense" ? "contained" : "outlined"}
                    color="error"
                    onClick={() => incomeExpenseToggle("expense")}>
                    支出
                  </Button>
                  <Button
                    variant={field.value === "income" ? "contained" : "outlined"}
                    color={"primary"}
                    onClick={() => incomeExpenseToggle("income")}>収入</Button>
                </ButtonGroup>
              )
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }} />
            )
            }
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField {...field} id="カテゴリ" label="カテゴリ" select>
                {categories.map((category) => (
                  <MenuItem value={category.label}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="金額" type="number" />
            )}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="内容" type="text" />
            )}
          />

          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={currentType === "income" ? "primary" : "error"} fullWidth>
            保存
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
