// components/custom/GameImage.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export type GameCardImageProps = {
  appid: number;
  name: string;
};

export const GameCardImage = ({ appid, name }: GameCardImageProps) => {
  const [src, setSrc] = useState(
    `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`,
  );

  return (
    <Image
      src={src}
      alt={name}
      width={400}
      height={215}
      className="border-b-2 select-none w-full h-full object-contain"
      onError={() => setSrc("https://placehold.co/400x125")}
    />
  );
};
