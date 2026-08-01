import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => {
  return (
    <button
      {...props}
      className={
        "hover:font-bold cursor-pointer text-black rounded-sm p-1 bg-slate-300 " +
        props.className
      }
    ></button>
  );
};
