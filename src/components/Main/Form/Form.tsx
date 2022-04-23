/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { ExpenseTrackerContext } from "../../../context/context";
import { Transaction } from "../../../types.t";
import useStyles from "./styles";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import {
  expenseCategories,
  incomeCategories,
} from "../../../constants/categories";
import formatDate from "../../../utils/formatDate";
import { useSpeechContext } from "@speechly/react-client";
import CustomizedSnackbar from "../../Snackbar/Snackbar";

const initialState: Transaction = {
  amount: 0,
  category: "",
  type: "Income",
  date: formatDate(new Date()),
};

const Form = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState<Transaction>(initialState);
  const { addTransaction } = useContext(ExpenseTrackerContext);
  const { segment } = useSpeechContext();
  const [open, setOpen] = useState(false);

  const createTransaction = () => {
    if (
      Number.isNaN(Number(formData.amount)) ||
      !formData.date.includes("-") ||
      !Number(formData.amount) ||
      !formData.category
    )
      return;
    addTransaction({
      ...formData,
      id: uuidv4(),
      amount: Number(formData.amount),
    });

    setFormData(initialState);
    setOpen(true);
  };

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === "add_expense") {
        setFormData({ ...formData, type: "Expense" });
      } else if (segment.intent.intent === "add_income") {
        setFormData({ ...formData, type: "Income" });
      } else if (
        segment.isFinal &&
        segment.intent.intent === "create_transaction"
      ) {
        return createTransaction();
      } else if (
        segment.isFinal &&
        segment.intent.intent === "cancel_transaction"
      ) {
        return setFormData(initialState);
      }

      segment.entities.forEach((entity) => {
        switch (entity.type) {
          case "amount":
            setFormData({ ...formData, amount: Number(entity.value) });
            break;
          case "category":
            if (
              incomeCategories
                .map((category) => category.type)
                .includes(entity.value[0] + entity.value.slice(1).toLowerCase())
            ) {
              setFormData({
                ...formData,
                type: "Income",
                category: entity.value[0] + entity.value.slice(1).toLowerCase(),
              });
            } else if (
              expenseCategories
                .map((category) => category.type)
                .includes(entity.value[0] + entity.value.slice(1).toLowerCase())
            ) {
              setFormData({
                ...formData,
                type: "Expense",
                category: entity.value[0] + entity.value.slice(1).toLowerCase(),
              });
            }
            break;

          case "date":
            setFormData({ ...formData, date: entity.value });
            break;
        }
      });

      if (
        segment.isFinal &&
        formData.amount &&
        formData.type &&
        formData.category &&
        formData.date
      ) {
        createTransaction();
      }
    }
  }, [createTransaction, formData, segment]);

  const categories =
    formData.type === "Income" ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          {segment && segment.words.map((word) => word.value).join(" ")}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value as "Income" | "Expense",
              });
            }}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value as string,
              });
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.type} value={category.type}>
                {category.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="number"
          label="Amount"
          fullWidth
          value={formData.amount}
          onChange={(e) => {
            setFormData({
              ...formData,
              amount: e.target.value as unknown as number,
            });
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="date"
          label="Date"
          fullWidth
          value={formData.date}
          onChange={(e) => {
            setFormData({
              ...formData,
              date: formatDate(e.target.value),
            });
          }}
        />
      </Grid>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        fullWidth
        onClick={createTransaction}
      >
        Create
      </Button>
    </Grid>
  );
};

export default Form;
