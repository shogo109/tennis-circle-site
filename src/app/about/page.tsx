import { Metadata } from "next";
import { AboutContent } from "./client";

export const metadata: Metadata = {
  title: "サークルについて | Joy'n Tennis",
  description:
    "Joy'n Tennis（ジョインテニス）は、一宮市・稲沢市を中心に活動するテニスサークルです。初心者から経験者まで、幅広いレベルの方が参加できます。",
  openGraph: {
    title: "サークルについて | Joy'n Tennis",
    description:
      "Joy'n Tennis（ジョインテニス）は、一宮市・稲沢市を中心に活動するテニスサークルです。初心者から経験者まで、幅広いレベルの方が参加できます。",
    images: [
      {
        url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2940",
        width: 2940,
        height: 1960,
        alt: "Joy'n Tennis",
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
