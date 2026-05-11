// app/page.tsx
import { ErrorBox } from "@/components/custom/ErrorBox";
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
import { resolveToSteamId, getPlayer, getSteamLevel } from "@/lib/api";
import { formatTimeCreated } from "@/lib/utils";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: query } = await searchParams;
  let data: any = null;
  let steamLevel: any = null;
  let error = "";

  if (query) {
    try {
      const steamId = await resolveToSteamId(query);
      data = await getPlayer(steamId);
      if (data) {
        steamLevel = await getSteamLevel(steamId);
      }
    } catch (error) {
      error = String(error);
    }
  }

  return (
    <main className="w-full">
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

      {!error && data && <pre>{JSON.stringify(data, null, 2)}</pre>}

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
                  <span className="hidden group-hover:block">Established:</span>
                  <span>{formatTimeCreated(data.timecreated)}</span>
                </Badge>

                <Badge className="group" variant="secondary">
                  <span className="hidden group-hover:block">Level:</span>
                  <span>{steamLevel.response.player_level}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
