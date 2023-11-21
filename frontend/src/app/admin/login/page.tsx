import {signInWithSlack} from '@/actions/auth'

export default async function Home() {
  return (
    <main className="grid-cols-1 flex flex-col items-start justify-between p-24 max-w-5xl bg-[#FFFFFF] text-[#153757] space-y-4">
        <form action={signInWithSlack}>
            <button type='submit' className="bg-green-500 text-white p-2 rounded">
                Login with Slack
            </button>
        </form>
    </main>
  )
}