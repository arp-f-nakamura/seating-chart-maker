import { ChangeEvent, MouseEventHandler } from "react";
import classes from "./css_modules/Input.module.css";

type InputProps = {
  title: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  buttonDetail?: {
    title: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  };
};

export const Input = ({
  title,
  value,
  onChange,
  buttonDetail,
  onBlur,
}: InputProps) => {
  return (
    <div className={classes.div}>
      <span>{title}</span>
      <input value={value} onChange={onChange} onBlur={onBlur} />
      {buttonDetail && (
        <button onClick={buttonDetail.onClick}>{buttonDetail.title}</button>
      )}
    </div>
  );
};
