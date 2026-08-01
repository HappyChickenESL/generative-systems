import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const FileUpload = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) => {
  return <input type="file" className="file-input" {...props} />;
};
