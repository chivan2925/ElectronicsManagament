import { createElement } from "react";
import { cn } from "../../utils/classNames";

const sizeClasses = {
  page: "max-w-[1440px]",
  wide: "max-w-[1600px]",
  narrow: "max-w-5xl",
};

function Container({ as: Component = "div", children, className, padded = true, size = "page", ...props }) {
  return createElement(
    Component,
    {
      className: cn("mx-auto", sizeClasses[size] || sizeClasses.page, padded && "px-4 lg:px-8", className),
      ...props,
    },
    children,
  );
}

export default Container;
