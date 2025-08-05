'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="w-full pt-6 pr-10 text-white text-sm flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <div className="flex items-center gap-4 mb-2 md:mb-0 flex-wrap">
          <span>
            Made by{' '}
            <Link href="https://aza3l.vercel.app/" className="text-emerald-600 underline">
              Azael
            </Link>
          </span>

          <a
            href="https://ko-fi.com/V7V31ITD4Y"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              height={36}
              style={{ border: 0, height: 36 }}
              src="https://storage.ko-fi.com/cdn/kofi5.png?v=6"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>

          <div className="flex items-center gap-3">
            <Link href="https://discord.gg/2bQU7xAdnP" target="_blank">
              <Image
                src="/icons/discord.svg"
                alt="Discord"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
            <Link href="https://www.reddit.com/r/satquestgame/" target="_blank">
              <Image
                src="/icons/reddit.svg"
                alt="Reddit"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
            <Link href="https://www.instagram.com/satquestgame/" target="_blank">
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
            <Link href="https://www.youtube.com/@satquestgame" target="_blank">
              <Image
                src="/icons/youtube.svg"
                alt="YouTube"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
            <Link href="https://bsky.app/profile/satquestgame.bsky.social" target="_blank">
              <Image
                src="/icons/bluesky.svg"
                alt="Bluesky"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
            <Link href="https://x.com/satquestgame" target="_blank">
              <Image
                src="/icons/twitter.svg"
                alt="Twitter"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>
          </div>

          {/* <div className="h-6 w-px bg-gray-300 mx-3" />

          <span className="text-white text-xs">
            Maps by{' '}
            <Link href="https://sierramaps.com" target="_blank" className="text-emerald-600 underline">
              SierraMaps
            </Link>
          </span> */}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/legal/privacy" className="text-emerald-600 underline">
            Privacy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/legal/terms" className="text-emerald-600 underline">
            Terms
          </Link>
          <span className="text-white text-xs">v0.1.0</span>
        </div>
      </div>
    </footer>
  )
}
