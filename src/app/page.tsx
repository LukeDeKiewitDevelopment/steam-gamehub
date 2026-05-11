// app/page.tsx
import { ErrorBox } from "@/components/custom/ErrorBox";
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
    </main>
  );
}
