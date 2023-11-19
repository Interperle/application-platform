import Logger from '@/logger/logger';
import Apl_Header from '@/components/header';
import getOverviewPageText from '@/utils/getMarkdownText';


export default async function Home() {
  const log = new Logger("Overview Page")
  const contentHtml = await getOverviewPageText();
  return (
    <main className="grid-cols-1 flex flex-col items-start justify-between p-24 max-w-5xl bg-[#FFFFFF] text-[#153757] space-y-4">
      <div className='flex flex-col items-start justify-between space-y-4'>
        <Apl_Header />
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
      <div className="w-full max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <h2 className="p-4 rounded font-bold">Bewerbungs-Phase 1</h2>
          <div className="p-4 rounded">PHASEN_STATUS_HIER</div>
          <button className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">Phase fortsetzen</button>
        </div>
      </div>
    </main>
  )
}
