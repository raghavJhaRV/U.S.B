"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  {
    title: "Legends Jersey",
    img: "/merch/jersey.jpg", // place images in /public/merch/
  },
  {
    title: "Classic T-Shirt",
    img: "/merch/tshirt.jpg",
  },
  {
    title: "Legends Hoodie",
    img: "/merch/hoodie.jpg",
  },
  {
    title: "Icon Snapback",
    img: "/merch/cap.jpg",
  },
];

export default function MerchandisePage() {
  return (
    <div className="bg-black text-white min-h-screen">


      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-10">
          Merchandise
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {products.map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={item.img}
                alt={item.title}
                className="w-full object-cover mb-4"
              />
              <p className="font-bold uppercase tracking-wide">{item.title}</p>
            </div>
          ))}
        </div>
      </main>


    </div>
  );
}
