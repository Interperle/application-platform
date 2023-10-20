import Link from 'next/link';
import Image from 'next/image'
import React from 'react';

const Apl_Header: React.FC = () => {
  return (
    <div className="w-full bg-white h-24 flex items-center justify-between p-4 md:p-6">
        <div className="min-w-[20px] max-w-[200px]">
            <Link href="https://generation-d.org" target="_blank">
                <Image src="/logos/gend_img_font.png" alt="Generation-D Logo" className="max-w-full h-auto" width={200} height={24}/>
            </Link>
        </div>

        <div className="flex space-x-4">
            <button className="text-[#153757] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-#537575">
            FAQs
            </button>
            <button className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">
                Ausloggen
            </button>
        </div>
    </div>
  );
};

export default Apl_Header;