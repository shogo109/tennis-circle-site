import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Joy'n Tennis | 名古屋のテニスサークル",
  description:
    "名古屋市を中心に活動する、アットホームなテニスサークルです。初心者から経験者まで、幅広い方々が参加しています。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className="scroll-smooth"
    >
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
