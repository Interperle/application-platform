import { FormEventHandler } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  text,
  expanded,
  onSubmit,
}: {
  text: string;
  expanded: boolean;
  onSubmit?: FormEventHandler<HTMLButtonElement> | null;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={`${expanded ? "apl-button-expanded" : "apl-button-fixed"}`}
      onSubmit={onSubmit ? (event) => onSubmit(event) : undefined}
    >
      {pending ? "Bitte warten..." : text}
    </button>
  );
}
