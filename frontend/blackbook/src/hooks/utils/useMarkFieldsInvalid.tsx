import type { ResponseError } from "@app/types";
import { useEffect } from "react";

export function useMarkFieldsInValid(errors: ResponseError[]) {
  useEffect(() => {
    let alteredElements: HTMLInputElement[] = [];
    for (let error of errors) {
      if (error.field) {
        const fieldEl: HTMLInputElement | null = document.getElementById(
          error.field,
        ) as HTMLInputElement;
        if (fieldEl) {
          fieldEl.setCustomValidity(error.message);
          fieldEl.reportValidity();
          alteredElements.push(fieldEl);
          fieldEl.addEventListener(
            "input",
            function clearError() {
              fieldEl.setCustomValidity("");
              fieldEl.removeEventListener("input", clearError);
            },
            { once: true },
          );
        }
      }
    }
    return () => {
      alteredElements.forEach((el) => {
        el.setCustomValidity("");
      });
    };
  }, [errors]); // it should be memoized
}
