import { Input } from "./Input";
import classes from "./css_modules/SeatingChart.module.css";

type SeatingChartProps = {
  name: string;
  seatCounts: number;
  names: string[];
  isEditing: boolean;
  onChangeSeatName: (seatIndex: number, newName: string) => void;
  onDeleteSeatName: (seatIndex: number) => void;
};

export const SeatingChart = ({
  name,
  seatCounts,
  names,
  isEditing,
  onChangeSeatName,
  onDeleteSeatName,
}: SeatingChartProps) => {
  return (
    <div className={classes.div}>
      <span>{name}卓</span>
      {Array.from({ length: seatCounts }, (_, i) => (
        <Input
          key={i}
          title={`席${i + 1}`}
          value={names[i]}
          disabled={!isEditing}
          onChange={(e) => onChangeSeatName(i, e.target.value)}
          buttonDetail={
            isEditing
              ? { title: "削除", onClick: () => onDeleteSeatName(i) }
              : undefined
          }
        />
      ))}
    </div>
  );
};
