"use client";
import Image from "next/image";
import Link from "next/link";

export default function NewsDetailPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-300 mb-2">April 20, 2024</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase mb-6">
          Lorem Ipsum Dolor Sit Amet
        </h1>

        <div className="w-full h-64 sm:h-96 bg-neutral-700 relative mb-6">
          <Image
            src="/images/media1.jpg"
            alt="News Image"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>

        <div className="text-sm text-gray-200 text-left space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
            minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis.
          </p>
          <p>
            Praesent tum teque nec. Donec non pacrits consectus et est. Culminod an
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit
            esse molestie consequat.
          </p>
          <p>
            Vel illum ut duis retem vel erum insoluipin consequat, velit Jurtar
            dorsae ac sumtum, enim azim dorem vel feugat sit luoaeuor trii, facilisis
            at vero eros.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/news"
            className="text-sm font-semibold border border-white px-4 py-2 inline-block hover:bg-white hover:text-black transition"
          >
            BACK TO NEWS
          </Link>
        </div>
      </div>
    </div>
  );
}
