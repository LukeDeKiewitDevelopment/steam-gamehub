import { SteamAchievement, SteamBadge, SteamBan, SteamFriend, SteamGame, SteamPlayer, SteamUserStat } from "@/types/types";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = process.env.STEAM_API_BASE_URL;



async function steamFetch<T = Record<string, unknown>>(
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

export async function getPlayerSummaries(steamIds: string[]): Promise<SteamPlayer[]> {
  const data = await steamFetch<{ response: { players: SteamPlayer[] } }>(
    "/ISteamUser/GetPlayerSummaries/v2/",
    { steamids: steamIds.join(",") }
  );
  return data.response.players;
}

export async function getPlayer(steamId: string): Promise<SteamPlayer | null> {
  const data = await steamFetch<{ response: { players: SteamPlayer[] } }>(
    "/ISteamUser/GetPlayerSummaries/v2/",
    { steamids: steamId }
  );
  return data.response.players[0] ?? null;
}

export async function getFriendList(steamId: string): Promise<SteamFriend[]> {
  const data = await steamFetch<{ friendslist: { friends: SteamFriend[] } }>(
    "/ISteamUser/GetFriendList/v1/",
    { steamid: steamId, relationship: "friend" }
  );
  return data.friendslist.friends;
}

export async function getPlayerBans(steamIds: string[]): Promise<SteamBan[]> {
  const data = await steamFetch<{ players: SteamBan[] }>(
    "/ISteamUser/GetPlayerBans/v1/",
    { steamids: steamIds.join(",") }
  );
  return data.players;
}

export async function getOwnedGames(steamId: string): Promise<{ games: SteamGame[]; game_count: number }> {
  const data = await steamFetch<{ response: { games?: SteamGame[]; game_count?: number } }>(
    "/IPlayerService/GetOwnedGames/v1/",
    { steamid: steamId, include_appinfo: "true", include_played_free_games: "true" }
  );
  return {
    games: data.response.games ?? [],
    game_count: data.response.game_count ?? 0,
  };
}

export async function getRecentlyPlayedGames(steamId: string): Promise<SteamGame[]> {
  const data = await steamFetch<{ response: { games?: SteamGame[] } }>(
    "/IPlayerService/GetRecentlyPlayedGames/v1/",
    { steamid: steamId, count: "10" }
  );
  return data.response.games ?? [];
}

export async function getPlayerAchievements(steamId: string, appId: string): Promise<SteamAchievement[]> {
  const data = await steamFetch<{ playerstats: { achievements: SteamAchievement[] } }>(
    "/ISteamUserStats/GetPlayerAchievements/v1/",
    { steamid: steamId, appid: appId }
  );
  return data.playerstats.achievements;
}

export async function getUserStatsForGame(steamId: string, appId: string): Promise<SteamUserStat[]> {
  const data = await steamFetch<{ playerstats: { stats: SteamUserStat[] } }>(
    "/ISteamUserStats/GetUserStatsForGame/v2/",
    { steamid: steamId, appid: appId }
  );
  return data.playerstats.stats;
}

export async function getWishlist(steamId: string) {
  return steamFetch("/IWishlistService/GetWishlist/v1/", { steamid: steamId });
}

export async function resolveVanityUrl(vanityUrl: string) {
  return steamFetch<{ response: { steamid?: string; success: number } }>(
    "/ISteamUser/ResolveVanityURL/v1/",
    { vanityurl: vanityUrl }
  );
}

export async function resolveToSteamId(input: string): Promise<string> {
  const isSteamId = /^\d{17}$/.test(input);
  if (isSteamId) return input;
  const data = await resolveVanityUrl(input);
  if (data.response.success !== 1 || !data.response.steamid) {
    throw new Error("Could not find Steam user");
  }
  return data.response.steamid;
}

export async function getBadges(steamId: string): Promise<SteamBadge[]> {
  const data = await steamFetch<{ response: { badges?: SteamBadge[] } }>(
    "/IPlayerService/GetBadges/v1/",
    { steamid: steamId }
  );
  return data.response.badges ?? [];
}

export async function getSteamLevel(steamId: string): Promise<number> {
  const data = await steamFetch<{ response: { player_level: number } }>(
    "/IPlayerService/GetSteamLevel/v1/",
    { steamid: steamId }
  );
  return data.response.player_level;
}