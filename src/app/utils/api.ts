

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = process.env.STEAM_API_BASE_URL;

async function steamFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.set("key", STEAM_API_KEY!);
  url.searchParams.set("format", "json");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  return res.json();
}

export async function getPlayerSummaries(steamIds: string[]) {
  return steamFetch("/ISteamUser/GetPlayerSummaries/v2/", {
    steamids: steamIds.join(","),
  });
}

export async function getFriendList(steamId: string) {
  return steamFetch("/ISteamUser/GetFriendList/v1/", {
    steamid: steamId,
    relationship: "friend",
  });
}

export async function getPlayerBans(steamIds: string[]) {
  return steamFetch("/ISteamUser/GetPlayerBans/v1/", {
    steamids: steamIds.join(","),
  });
}

export async function getOwnedGames(steamId: string) {
  return steamFetch("/IPlayerService/GetOwnedGames/v1/", {
    steamid: steamId,
    include_appinfo: "true",
    include_played_free_games: "true",
  });
}

export async function getRecentlyPlayedGames(steamId: string) {
  return steamFetch("/IPlayerService/GetRecentlyPlayedGames/v1/", {
    steamid: steamId,
    count: "10",
  });
}

export async function getPlayerAchievements(steamId: string, appId: string) {
  return steamFetch("/ISteamUserStats/GetPlayerAchievements/v1/", {
    steamid: steamId,
    appid: appId,
  });
}

export async function getUserStatsForGame(steamId: string, appId: string) {
  return steamFetch("/ISteamUserStats/GetUserStatsForGame/v2/", {
    steamid: steamId,
    appid: appId,
  });
}

export async function getWishlist(steamId: string) {
  return steamFetch("/IWishlistService/GetWishlist/v1/", {
    steamid: steamId,
  });
}
