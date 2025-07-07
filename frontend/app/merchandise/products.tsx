export type Product = {
  id: string;
  title: string;
  price: number;
  sizes: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: "jersey-1",
    title: "Legends Jersey",
    price: 49.99,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/media1.jpg",
  },
  {
    id: "tee-1",
    title: "Classic T-Shirt",
    price: 24.99,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/media1.jpg",
  },
  {
    id: "hoodie-1",
    title: "Legends Hoodie",
    price: 59.99,
    sizes: ["M", "L", "XL"],
    image: "/images/media1.jpg",
  },
  {
    id: "cap-1",
    title: "Icon Snapback",
    price: 19.99,
    sizes: ["One Size"],
    image: "/images/media1.jpg",
  },
];

