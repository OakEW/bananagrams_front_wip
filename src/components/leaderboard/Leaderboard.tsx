import { useState } from "react";

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="star anim-poppop"
        style={{ animationDelay: "1.0s" }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="popup_lead">
          <button className="close" onClick={() => setIsOpen(false)} />
          <p style={{ color: "#ffbb12", position: "absolute", top: 0, right: 18, fontSize: 18 }}>
            Leaderboard
          </p>
          <p style={{ color: "#eddebd", 
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      position: "absolute",
                      top: "35%",
                      left: "50%",
                      transform: "translateX(-50%)"}}>
            🚧 Leaderboard coming soon 🚧</p>
        </div>
      )}
    </>
  );
}
