"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export type GameCardImageProps = {
  appid: number;
  name: string;
};

export const GameCardImage = ({ appid, name }: GameCardImageProps) => {
  const [error, setError] = useState(false);

  return (
    <Image
      src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`}
      alt={name}
      width={400}
      height={215}
      className={cn(
        error && "bg-muted flex items-center justify-center text-center",
        "h-full w-full border-b-2 object-contain text-xs select-none",
      )}
      onError={() => setError(true)}
    />
  );
};
