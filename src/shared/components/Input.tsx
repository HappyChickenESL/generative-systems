import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Input = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label: string },
) => {
  return (
    <div className="flex flex-col space-y-2">
      <label>{props.label}</label>
      <input
        {...props}
        className={
          (props.type !== "range"
            ? "input bg-gray-400 text-black h-8 text-base"
            : "") + props.className
        }
      />
    </div>
  );
};
