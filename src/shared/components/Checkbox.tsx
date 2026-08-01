import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Checkbox = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label: string },
) => {
  return (
    <div className="flex space-x-2">
      <label>{props.label}</label>
      <input
        type="checkbox"
        defaultChecked
        {...props}
        className={"checkbox bg-gray-300 text-black " + props.className}
      />
    </div>
  );
};
