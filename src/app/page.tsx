import { ErrorBox } from "@/components/custom/ErrorBox";
import { GameCard } from "@/components/custom/GameCard";
import PersonaStateBadge from "@/components/custom/PersonaStateBadge";
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
import { cn, formatTimeCreated } from "@/lib/utils";
import { SteamBadge, SteamGame, SteamPlayer } from "@/types/types";

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
        <h1 className="flex flex-col text-center text-xl uppercase md:text-3xl">
          <span className="font-bold">Steam Player Search</span>
          <span className="text-muted-foreground text-center text-xs">
            by{" "}
            <a
              href="https://lukedekiewit-cv.vercel.app/"
              target="_blank"
              className="text-[#0f9] hover:underline"
            >
              Luke De Kiewit
            </a>
          </span>
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
          <Card
            className={cn(
              isAdmin && "bg-[#ffb600] text-black shadow-md shadow-black/60",
            )}
          >
            <CardHeader>
              <CardTitle className={cn(isAdmin && "text-black")}>
                {isAdmin ? "Admin" : "Player"}
              </CardTitle>
              <CardAction>
                <div className="flex items-center gap-2">
                  <a
                    href={data.profileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className={cn(
                        isAdmin &&
                          "bg-black! text-[#ffb600]! hover:bg-black/95!",
                      )}
                      variant="outline"
                    >
                      View Steam Profile
                    </Button>
                  </a>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                <Avatar className="h-46 max-h-46 w-46 max-w-46 rounded-none border-2 shadow-md shadow-black/50">
                  <AvatarImage
                    className="rounded-none border-none"
                    src={data.avatarfull}
                  />
                </Avatar>
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-center text-3xl font-bold md:text-left">
                      {data.personaname}
                    </h2>
                    <p className="text-muted-foreground text-center md:text-left">
                      {data.realname}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    {!isAdmin && (
                      <PersonaStateBadge personastate={data.personastate} />
                    )}
                    {isAdmin && (
                      <Badge className="bg-black text-[#ffb600]">Coding</Badge>
                    )}
                    {!isAdmin && (
                      <Badge variant="secondary">Level {steamLevel}</Badge>
                    )}
                    {isAdmin && (
                      <Badge className="bg-black text-[#ffb600]">
                        Level {steamLevel}
                      </Badge>
                    )}
                    {!isAdmin && (
                      <Badge variant="outline">
                        Joined {formatTimeCreated(data.timecreated)}
                      </Badge>
                    )}
                    {isAdmin && (
                      <Badge className="bg-black text-[#ffb600]">
                        Joined {formatTimeCreated(data.timecreated)}
                      </Badge>
                    )}
                  </div>
                  <Separator className={cn(isAdmin && "bg-black!")} />
                  <div className="flex flex-wrap justify-center gap-8 md:justify-start">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          isAdmin && "text-black!",
                          "text-muted-foreground text-center text-sm md:text-left",
                        )}
                      >
                        Games Owned
                      </span>
                      <span className="text-center text-xl font-semibold md:text-left">
                        {isAdmin
                          ? "2147483647"
                          : !isAdmin && gameCount !== 0
                            ? gameCount
                            : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          isAdmin && "text-black!",
                          "text-muted-foreground text-center text-sm md:text-left",
                        )}
                      >
                        Badges
                      </span>
                      <span className="text-center text-xl font-semibold md:text-left">
                        {isAdmin ? "9999999999" : badges.length}
                      </span>
                    </div>
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
                    No games played in the last two weeks.
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
                  <span className="text-muted-foreground">Private.</span>
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
