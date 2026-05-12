// app/page.tsx
import { ErrorBox } from "@/components/custom/ErrorBox";
import { GameCard } from "@/components/custom/GameCard";
import PersonaStateBadge from "@/components/custom/PersonaStateBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  resolveToSteamId,
  getPlayer,
  getSteamLevel,
  getBadges,
  getOwnedGames,
  getRecentlyPlayedGames,
  getFriendList,
} from "@/lib/api";
import { formatTimeCreated } from "@/lib/utils";
import { SteamBadge, SteamFriend, SteamGame, SteamPlayer } from "@/types/types";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  let data: SteamPlayer | null = null;
  let steamLevel: number | null = null;
  let error = "";
  let badges: SteamBadge[] = [];
  let games: SteamGame[] = [];
  let gameCount: number = 0;
  let recentlyPlayedGames: SteamGame[] = [];

  if (query) {
    try {
      const steamId = await resolveToSteamId(query);
      data = await getPlayer(steamId);
      if (data) {
        [
          steamLevel,
          badges,
          { games, game_count: gameCount },
          recentlyPlayedGames,
        ] = await Promise.all([
          getSteamLevel(steamId),
          getBadges(steamId),
          getOwnedGames(steamId),
          getRecentlyPlayedGames(steamId),
        ]);
      }
    } catch (e) {
      error = String(e);
    }
  }
  const isAdmin = query === "nuttshellman" || query === "76561198391254868";

  return (
    <main className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
        <h1 className="text-center text-xl font-bold uppercase md:text-3xl">
          Steam Player Search
        </h1>
        <form method="GET" className="flex items-center justify-center gap-2">
          <Input
            name="query"
            defaultValue={query ?? ""}
            placeholder="Steam ID or Custom URL"
            className="max-w-none md:max-w-3/5"
          />
          <Button type="submit">Search</Button>
        </form>

        {error && (
          <ErrorBox
            className="border-0 bg-transparent text-center"
            error={error}
          />
        )}
      </div>

      {data && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
              <CardAction>
                <div className="flex items-center gap-2">
                  <a
                    href={data.profileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>View Profile</Button>
                  </a>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Avatar className="h-46 w-46">
                  <AvatarImage className="rounded-none" src={data.avatarfull} />
                </Avatar>
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl">{data.personaname}</h2>
                  <h3>{data.realname}</h3>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <PersonaStateBadge personastate={data.personastate} />
                    <Badge className="group">
                      <span className="hidden group-hover:block">
                        Established:
                      </span>
                      <span>{formatTimeCreated(data.timecreated)}</span>
                    </Badge>

                    <Badge className="group" variant="secondary">
                      <span className="hidden group-hover:block">Level:</span>
                      <span>{steamLevel}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {!error && recentlyPlayedGames && !isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Recently Played ({recentlyPlayedGames.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentlyPlayedGames.length === 0 && (
                  <span className="text-muted-foreground">
                    No recently played games.
                  </span>
                )}
                <div className="flex w-full flex-wrap items-center gap-4">
                  {recentlyPlayedGames.length !== 0 &&
                    recentlyPlayedGames.map((game) => (
                      <GameCard
                        key={game.appid}
                        game={game}
                        showRecentPlaytime
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
          {!error && games && !isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Owned Games ({gameCount})</CardTitle>
              </CardHeader>
              <CardContent>
                {games.length === 0 && (
                  <span className="text-muted-foreground">No owned games.</span>
                )}
                <div className="flex w-full flex-wrap items-center gap-4">
                  {games.length !== 0 &&
                    games.map((game) => (
                      <GameCard key={game.appid} game={game} />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
