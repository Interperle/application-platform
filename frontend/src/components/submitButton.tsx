import { useFormStatus } from "react-dom";

export function SubmitButton({
  text,
  expanded,
}: {
  text: string;
  expanded: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={`${expanded ? "apl-button-expanded" : "apl-button-fixed"}`}
    >
      {pending ? "Bitte warten..." : text}
    </button>
  );
}
