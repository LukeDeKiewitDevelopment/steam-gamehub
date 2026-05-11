// app/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveToSteamId, getPlayerSummaries } from "@/lib/api";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: query } = await searchParams;
  let data: any = null;
  let error = "";

  if (query) {
    try {
      const steamId = await resolveToSteamId(query);
      data = await getPlayerSummaries([steamId]);
    } catch (e) {
      error = String(e);
    }
  }

  return (
    <main>
      <form method="GET">
        <Input
          name="query"
          defaultValue={query ?? ""}
          placeholder="Steam ID or Custom URL"
        />
        <Button type="submit">Search</Button>
      </form>

      {error && <p>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
