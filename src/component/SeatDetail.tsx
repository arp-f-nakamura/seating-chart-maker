import classes from "./css_modules/Input.module.css";

type SeatDetailProps = {
  count: number;
  name: string;
};

export const SeatDetail = ({ count, name }: SeatDetailProps) => {
  return (
    <div className={classes.div}>
      <span>{`席${count + 1}`}</span>
      <span>{name}</span>
    </div>
  );
};
