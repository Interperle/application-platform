// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Apl_Footer: React.FC = () => {
  return (
    <footer className="bg-primary h-[256px] items-center justify-center space-y-8 mt-4">
      <div className="items-center justify-center flex flex-row md:flex-col md:space-x-8 space-y-8">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-4 md:space-y-0 text-secondary font-nunito">
          <Link href="https://generation-d.org/legal/" target="_blank">Impressum</Link>
          <Link href="https://generation-d.org/legal/" target="_blank">Disclaimer</Link>
          <Link href="https://generation-d.org/legal/" target="_blank">Datenschutzerklärung</Link>
        </div>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-4 md:space-y-0">
          <Link href="https://de-de.facebook.com/GenerationD/" target="_blank">
            <Image
              src="/icons/social_media/facebook.svg"
              width={24}
              height={24}
              alt="Facebook"
              className="w-6 h-6"
            />
          </Link>
          <Link
            href="https://www.instagram.com/generationd_org/?hl=de"
            target="_blank"
          >
            <Image
              src="/icons/social_media/instagram.svg"
              width={24}
              height={24}
              alt="Instagram"
              className="w-6 h-6"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/generation-d.org?original_referer=https%3A%2F%2Fwww.google.com%2F"
            target="_blank"
          >
            <Image
              src="/icons/social_media/linkedin.svg"
              width={24}
              height={24}
              alt="Linked In"
              className="w-6 h-6"
            />
          </Link>
          <Link
            href="https://generation-d.org/bewerber/#h-fragen-antworten"
            target="_blank"
          >
            <Image
              src="/icons/social_media/mail.svg"
              width={24}
              height={24}
              alt="Contact"
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>
      <div className="items-center justify-center text-secondary font-nunito flex flex-col ">
        ©{new Date(Date.now()).getFullYear()} Generation-D. All rights reserved.
      </div>
    </footer>
  );
};

export default Apl_Footer;
