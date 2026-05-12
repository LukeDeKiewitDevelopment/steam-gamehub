export interface SteamPlayer {
  steamid: string;
  personaname: string;
  avatarfull: string;
  avatar: string;
  avatarmedium: string;
  profileurl: string;
  personastate: number;
  communityvisibilitystate: number;
  profilestate: number;
  lastlogoff: number;
  timecreated: number;
  realname?: string;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
  gameextrainfo?: string;
  gameid?: string;
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url: string;
  rtime_last_played?: number;
  has_community_visible_stats?: boolean;
  has_leaderboards?: boolean;
  content_descriptorids?: number[];
}

export interface SteamFriend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export interface SteamBan {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

export interface SteamBadge {
  badgeid: number;
  level: number;
  completion_time: number;
  xp: number;
  scarcity: number;
  appid?: number;
}

export interface SteamAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
  name?: string;
  description?: string;
}

export interface SteamUserStat {
  name: string;
  value: number;
}
