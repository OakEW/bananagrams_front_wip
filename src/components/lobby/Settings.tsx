interface SettingsProps {
  peelCheckEnabled: boolean;
  onTogglePeel: () => void;
  botEnabled: boolean;
  onToggleBot: () => void;
  level: number;
  onLevelClick: () => void;
}

// Settings no longer owns ANY state 
// every value and every click handler comes in as props from App
export default function Settings({
  peelCheckEnabled,
  onTogglePeel,
  botEnabled,
  onToggleBot,
  level,
  onLevelClick,
}: SettingsProps) {
  return (
    <div className="settings">
      <img
        src={peelCheckEnabled ? "assets_home/peel1.svg" : "assets_home/peel0.svg"}
        className="peel anim-poppop"
        style={{ animationDelay: "1.0s" }}
        onClick={onTogglePeel}
      />
      <img
        src={botEnabled ? "assets_home/bot1.svg" : "assets_home/bot0.svg"}
        className="bot anim-poppop"
        style={{ animationDelay: "1.0s" }}
        onClick={onToggleBot}
      />
      <img
        src={botEnabled ? `assets_home/lv${level}.svg` : "assets_home/lv0.svg"}
        className="lv anim-poppop"
        style={{ animationDelay: "1.0s" }}
        onClick={onLevelClick}
      />
    </div>
  );
}
