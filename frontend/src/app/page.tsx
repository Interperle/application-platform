import Logger from "@/logger/logger";
import Apl_Header from "@/components/header";
import getOverviewPageText from "@/utils/getMarkdownText";

export default async function Home() {
  const log = new Logger("Overview Page");
  const contentHtml = await getOverviewPageText();
  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      <div className="w-full max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <h2 className="p-4 rounded font-bold">Bewerbungs-Phase 1</h2>
          <div className="p-4 rounded">PHASEN_STATUS_HIER</div>
          <button className="apl-button-fixed">Phase fortsetzen</button>
        </div>
      </div>
    </>
  );
}
