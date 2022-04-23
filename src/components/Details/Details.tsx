import { Card, CardContent, Typography, CardHeader } from "@material-ui/core";
import useTransactions from "../../useTransactions";
import useStyles from "./styles";
//@ts-ignore
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface Props {
  title: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Details: React.FC<Props> = ({ title }) => {
  const classes = useStyles();
  const { total, chartData } = useTransactions(title);

  return (
    <Card className={title === "Income" ? classes.income : classes.expense}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="h5">{total}$</Typography>
        <Doughnut data={chartData} />
      </CardContent>
    </Card>
  );
};
export default Details;
