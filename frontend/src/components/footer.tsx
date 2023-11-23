// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Apl_Footer: React.FC = () => {
  return (
    <footer className="bg-primary h-[256px] flex flex-col items-center justify-center space-y-8">
      <div className="flex space-x-8 text-secondary font-nunito">
        <Link href="https://generation-d.org/legal/">Impressum</Link>
        <Link href="https://generation-d.org/legal/">Disclaimer</Link>
        <Link href="https://generation-d.org/legal/">Datenschutzerklärung</Link>
      </div>

      <div className="flex space-x-8">
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

      <div className="text-secondary font-nunito">
        © 2024 Generation-D. All rights reserved.
      </div>
    </footer>
  );
};

export default Apl_Footer;
