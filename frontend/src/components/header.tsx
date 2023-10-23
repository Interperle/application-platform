"use client"
import Link from 'next/link';
import Image from 'next/image'
import React from 'react';

const Apl_Header: React.FC = () => {
    const handlePostRequest = async () => {
        try {
            const response = await fetch('/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Your POST request payload goes here
            }),
            });

            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
        };
        
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
                <button type="button" onClick={handlePostRequest} className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">
                    Ausloggen
                </button>
            </div>
        </div>
    );
};

export default Apl_Header;