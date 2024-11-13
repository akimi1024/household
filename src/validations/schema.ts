import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, {message: "日付は必須です"}),
  amount: z.number().min(1, {message: "金額は1円以上を入力してください"}),
  content: z.string().min(1, {message: "内容を入力してください"}).max(50, {message: "内容は50文字以内で入力してください"}),
  category: z
    .string()
    .refine((val) => ["食費", "日用品", "住居費", "交際費", "娯楽", "交通費", "給与", "副収入", "お小遣い"].includes(val), {
      message: "カテゴリーを選択してください",
    })
})

export type Schema = z.infer<typeof transactionSchema>