import Apl_Header from '@/components/header'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="grid-cols-1 flex flex-col items-start justify-between p-24 max-w-5xl bg-[#FFFFFF] text-[#153757] space-y-4">
        <div className='flex flex-col items-start justify-between space-y-4'>
          <Apl_Header/>
          <h1 className="text-lg font-bold">
            Herzlich willkommen zur Generation-D Bewerbung 2023!
          </h1>
          <p>
            Wir freuen uns sehr, dass Ihr Euch bei Generation-D bewerben möchtet.
          </p>
          <p>
            Aktuell läuft die erste Bewerbungsphase, in welcher es darum geht einige Fragen zu Euerem Start-up/Projekt zu beantworten und zu jedem Teammitglied einen Lebenslauf hochzuladen.
          </p>
          <strong>
            Seid Euch bewusst, dass Generation-D keine Bewerbungen akzeptieren kann…
          </strong>
          <ul className="list-none pl-5">
            <li>
              …in welchen ein Teammitglied aktueller oder ehemaliger Stipendiat*in der Bayerischen EliteAkademie ist,
            </li>
            <li>
              …das Projekt bereits in einem Generation-D Finale gewesen ist,
            </li>
            <li>
              …es sich um ein langfristig rein spenden basiertes Projekt handelt,
            </li>
            <li>
              …oder das Unternehmen bereits länger als 5 Jahre im Handelsregister eingetragen ist.
            </li>
          </ul>
          <p>
            Weitere Details zum Ablauf und der Bewertung könnt Ihr auch nochmal in unserem <Link href="https://generation-d.org/wp-content/uploads/2022/12/Ablauf_des_Bewerbungsprozesses_2023.pdf" target='_blank' className="font-bold font-underline">Leitfaden</Link> nachlesen.
          </p>

          <h2 className="font-bold">Kurz noch einige allgemeine Hinweise:</h2>
          <p>
            Alle eure Angaben werden automatisch gespeichert. Ihr könnt eure Antworten aber vor der Deadline (<strong>18.02.2023</strong>) so oft Ihr wollt weiterhin bearbeiten.
          </p>
          <p>
            Eine Bewerbung wird erst berücksichtigt, wenn sie vollständig ist. Vollständig ist eine Bewerbung, wenn alle Fragen beantwortet wurden. Den Status eurer Bewerbung könnt Ihr auch immer auf dieser Übersichtsseite einsehen.
          </p>
          <p>
            <i>Ihr werdet auch über alle weiteren Phasen und Vorgehen per E-Mail informiert.</i> Kontrolliert dafür bitte, dass die angegebene E-Mail korrekt ist und checkt auch den Spam Ordner.
          </p>
          <h3 className='font-bold'>Dann kann es jetzt losgehen! Klickt unten auf “Bewerbung bearbeiten” und startet durch!</h3>
          <p>Wir freuen uns auf Euch und eure Ideen und wünschen Euch viel Erfolg!</p>
          <p>
            Euer Generation-D Team
          </p>
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
