"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_IMAGE, API_URL } from "./constants";
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Player = {
  id: string;
  name: string;
  imageUrl?: string;
  achievements?: string;
  year?: string;
};

export default function Home() {
  const [hallOfFame, setHallOfFame] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use mock data since we don't have a Hall of Fame API endpoint
    // In the future, you can replace this with: fetch(`${API_URL}/api/hall-of-fame`)
    const mockHallOfFame: Player[] = [
      { id: "1", name: "Kyler Varga", imageUrl: "/images/image1.jpg" },
      { id: "2", name: "Ike Imegwu", imageUrl: "/images/image2.jpg" },
      { id: "3", name: "Angela Lee", imageUrl: "/images/image3.jpg" },
      { id: "4", name: "Sam Nichols", imageUrl: "/images/image4.jpg" },
      { id: "5", name: "Wol Wol", imageUrl: "/images/image5.jpg" },
      { id: "6", name: "Player 6", imageUrl: "/images/image6.jpg" },
      { id: "7", name: "Player 7", imageUrl: "/images/image7.jpg" },
      { id: "8", name: "Player 8", imageUrl: "/images/image8.jpg" },
      { id: "9", name: "Player 9", imageUrl: "/images/media1.jpg" },
      { id: "10", name: "Player 10", imageUrl: "/images/event1.jpg" },
    ];

    setHallOfFame(mockHallOfFame);
    setLoading(false);
  }, []);

  return (

    // I want it to be in center of the page
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        <img src={DEFAULT_IMAGE} alt="logo" />
        <p className="text-2xl font-bold">United S.T.O.R.M. Basketball</p>



        <p className="text-sm">
          We&apos;re working on getting everything back up and running! this monday sorry for the inconvenience 😅.
        </p>
      </div>
    </div>
  );
}




