import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transaction } from '../types';
import { financeCalculations } from '../utils/financeCalculations';
import { Grid } from '@mui/material';
import { formantCurrency } from '../utils/formatting';
import iconComponents from './common/iconComponents';

interface Data {
  id: number;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(
  id: number,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
): Data {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(2, 'Donut', 452, 25.0, 51, 4.9),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData(9, 'KitKat', 518, 26.0, 65, 7.0),
  createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
  createData(11, 'Marshmallow', 318, 0, 81, 2.0),
  createData(12, 'Nougat', 360, 19.0, 9, 37.0),
  createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface _TransactionTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

/**
 * テーブルヘッド作成メソッド
 * @param props
 * @returns
 */
function TransactionTableHead(props: _TransactionTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    console.log({rowCount})
    console.log({numSelected})

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>

        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>カテゴリ</TableCell>
        <TableCell align={"left"}>金額</TableCell>
        <TableCell align={"left"}>内容</TableCell>
      </TableRow>
    </TableHead>
  );
}
interface TransactionTableToolbarProps {
  numSelected: number;
}

/**
 * ツールバー作成
 * @param props
 * @returns
 */
function TransactionTableToolbar(props: TransactionTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の収支
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface FinanceCalItemProps {
  title: string,
  value: number,
  color: string
}

/**
 * 収支表示プロップス
 * @param FinanceCalItemProp
 * @returns
*/
function FinanceCalItem({ title, value, color }: FinanceCalItemProps) {
  return (
    <Grid item xs={4} textAlign={"center"}>
      <Typography variant="subtitle1" component={"div"}>
        {title}
      </Typography>
      <Typography
        fontWeight={"fontWeightBold"}
        component={"span"}
        sx={{
          color: color,
          fontSize: {xs: ".8rem", sm: "1rem", md: "1.2rem"},
          wordBreak: 'break-word'
        }}
      >
        ¥{formantCurrency(value)}
      </Typography>
    </Grid>
  )
}

interface TransactionTableProps {
  monthlyTransactions: Transaction[]
}

/**
 * テーブル作成メソッド
 * @returns
 */
export default function TransactionTable({ monthlyTransactions }: TransactionTableProps) {

  const theme = useTheme()

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>{
      const copyMonthlyTransactions = [...monthlyTransactions]
        return copyMonthlyTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [monthlyTransactions, page, rowsPerPage]);

  const { income, expense, balance } = financeCalculations(monthlyTransactions)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* 収支表示エリア */}
        <Grid container sx={{borderBottom: "1px solid rgba(224, 224, 224, 1)"}}>
          <FinanceCalItem
            title={"収入"}
            value={income}
            color={theme.palette.incomeColor.main}
          />
          <FinanceCalItem
            title={"支出"}
            value={expense}
            color={theme.palette.expenseColor.main}
          />
          <FinanceCalItem
            title={"残高"}
            value={balance}
            color={theme.palette.balanceColor.main}
          />
        </Grid>

          {/* ツールバー */}
          <TransactionTableToolbar numSelected={selected.length} />
          {/* 取引一覧 */}
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <TransactionTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={monthlyTransactions.length}
              />
              {/* 取引内容 */}
              <TableBody>
                {visibleRows.map((transaction, index) => {
                  const isItemSelected = selected.includes(transaction.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, transaction.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={transaction.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {transaction.date}
                      </TableCell>
                      <TableCell align='left' sx={{display: "flex", alignItems: "center"}}>
                          {iconComponents[transaction.category]}
                          {transaction.category}
                      </TableCell>
                      <TableCell align="left">{transaction.amount}</TableCell>
                      <TableCell align="left">{transaction.content}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* テーブル下部 */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </Paper>
    </Box>
  );
}
