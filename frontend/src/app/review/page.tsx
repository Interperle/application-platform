import { fetchAllUsers } from "@/actions/admin";

export default function Page() {
  return (
    <div>
      <div>REVIEW DASHBOARD</div>
      <form action={fetchAllUsers}>
        <button className="apl-button-fixed" type="submit">
          Pressen
        </button>
      </form>
    </div>
  );
}
