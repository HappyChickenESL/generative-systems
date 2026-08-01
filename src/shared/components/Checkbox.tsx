import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Checkbox = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label: string },
) => {
  return (
    <div className="flex space-x-2 text-sm">
      <label>{props.label}</label>
      <input
        type="checkbox"
        defaultChecked
        {...props}
        className={"checkbox bg-gray-300 text-black h-5 w-5 " + props.className}
      />
    </div>
  );
};
