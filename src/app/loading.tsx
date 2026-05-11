import { GameControllerIcon } from "@phosphor-icons/react/dist/ssr";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center py-8">
      <span>
        <GameControllerIcon className="h-12 w-12 animate-bounce" />
      </span>
    </div>
  );
}
