import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastLogoff(lastlogoff: number): string {
  return new Date(lastlogoff * 1000).toLocaleString();
}

export function formatTimeCreated(timecreated: number): string {
  return new Date(timecreated * 1000).toLocaleDateString();
}

export function formatPersonaState(personastate: number): string {
  const states: Record<number, string> = {
    0: "Offline",
    1: "Online",
    2: "Busy",
    3: "Away",
    4: "Snooze",
    5: "Looking to Trade",
    6: "Looking to Play",
  };
  return states[personastate] ?? "Unknown";
}

export function getAppStoreUrl(appId: number): string {
  return `https://store.steampowered.com/app/${appId}/`;
}

export function formatPlaytime(minutes: number | undefined): string {
  if (minutes === undefined) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
