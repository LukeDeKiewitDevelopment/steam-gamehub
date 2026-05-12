import { SteamGame } from "@/types/types";
import Image from "next/image";
import { GameCardImage } from "./GameCardImage";
import { formatPlaytime, getAppStoreUrl } from "@/lib/utils";

export type GameCardProps = {
  game: SteamGame;
  showRecentPlaytime?: boolean;
};

export const GameCard = ({ game, showRecentPlaytime }: GameCardProps) => {
  return (
    <a
      href={getAppStoreUrl(game.appid)}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card flex w-[calc(100%-1rem)] grow-0 flex-col items-center gap-2 overflow-hidden rounded-md border-2 pb-2 sm:w-[calc(50%-1rem)] md:w-[calc(33%-1rem)] lg:w-[calc(20%-1rem)]"
      key={game.appid}
      title={game.name}
    >
      <GameCardImage appid={game.appid} name={game.name} />
      {showRecentPlaytime ? (
        <span className="text-muted-foreground text-xs uppercase">
          {formatPlaytime(game.playtime_2weeks)} played
        </span>
      ) : (
        <span className="text-muted-foreground text-xs uppercase">
          {formatPlaytime(game.playtime_forever)} played
        </span>
      )}
    </a>
  );
};
