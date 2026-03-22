import { NumericFormat } from "react-number-format";

interface NumberFormatProps {
  value: number;
  displayType?: "text" | "input";
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  thousandSeparator?: boolean;
}

const NumberFormat = (props: NumberFormatProps) => {
  return (
    <NumericFormat
      thousandSeparator={props.thousandSeparator ?? true}
      value={props.value}
      displayType={props.displayType ?? "text"}
      decimalScale={props.decimalScale}
      fixedDecimalScale={props.fixedDecimalScale}
    />
  );
};

export default NumberFormat;
