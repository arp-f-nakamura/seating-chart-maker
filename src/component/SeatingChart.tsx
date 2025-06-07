import { Input } from "./Input";
import { SeatDetail } from "./SeatDetail";
import classes from "./css_modules/SeatingChart.module.css";

type SeatingChartPropt = {
  name: string;
  seatCounts: number;
  names: string[];
};

export const SeatingChart = ({
  name,
  seatCounts,
  names,
}: SeatingChartPropt) => {
  return (
    <div className={classes.div}>
      <span>{name}卓</span>
      {Array.from({ length: seatCounts }, (_, i) => (
        <SeatDetail key={i} count={i} name={names[i]} />
      ))}
    </div>
  );
};
