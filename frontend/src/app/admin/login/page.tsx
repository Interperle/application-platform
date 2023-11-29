import Image from "next/image";
import { signInWithSlack } from "@/actions/auth";

export default async function Home() {
  return (
    <main className="grid-cols-1 flex flex-col items-center justify-between space-y-6">
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50"
      />
      <h1 className="text-5xl text-secondary">Generation-D Internal Login</h1>
      <form action={signInWithSlack}>
        <button
          type="submit"
          className="apl-button-fixed-big flex items-center"
        >
          <Image
            src="/logos/slack.png"
            width={30}
            height={30}
            alt="Slack Image Logo"
            className="max-w-50 max-h-50"
          />
          <strong className="ml-2">Login mit Slack</strong>
        </button>
      </form>
    </main>
  );
}
