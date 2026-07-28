import { useState, useEffect } from "react";

interface ChatProps {
  userName: string;
  isLogin: boolean;
}

export default function Chat({ userName, isLogin }: ChatProps)  {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(true);

  useEffect(() => {
      setHasNewMsg(true);
    }, [isLogin]);
  
  function openChat() {
    setIsOpen(true);
    if (!isOpen)
      setHasNewMsg(false); // clear the dot once open it
  }

  return (
    <>
    {userName && (
      <>
      <div
        className="user_img anim-poppop"
        style={{ animationDelay: "1s" }}
        onClick={openChat}
      >
        <img src={
                  userName
                  ? `assets_users/${userName}.png`
                  : "assets_users/default.png"
        }
        onError={(e) => {
          e.currentTarget.src = "assets_users/default.png";
        }}
      />
        {hasNewMsg && <div className="new_msg_dot" />}
      </div>

      {isOpen && (
        <div className="popup_chat">
          <button className="close" onClick={() => setIsOpen(false)} />
          <p style={{ color: "#ffbb12", position: "absolute", top: 2, right: 60, fontSize: 18 }}>
            {userName}
          </p>
          <div className="user" style={{position: "absolute", right:10, top:10}}>
            <img src={
                      userName
                      ? `assets_users/${userName}.png`
                      : "assets_users/default.png"
            }
            onError={(e) => {
              e.currentTarget.src = "assets_users/default.png";
            }}
          />
          </div>
          <p style={{ color: "#eddebd", textAlign: "center",
                      whiteSpace: "nowrap",
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translateX(-50%)"}}>
            🚧 chat room coming soon 🚧
          </p>
        </div>
      )}
      </>
    )}
    </>
  );
}
