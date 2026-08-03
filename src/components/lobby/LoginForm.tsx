import { useState } from "react";

interface LoginFormProps {
  userName: string;
  setUserName: (value: string) => void;
  passWord: string;
  setPassWord: (value: string) => void;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export default function LoginForm({
  userName,
  setUserName,
  passWord,
  setPassWord,
  isLogin,
  setIsLogin,
}: LoginFormProps){
  //tmp input
  const [inputUserName, setInputUserName] = useState("");
  const [inputPassWord, setInputPassWord] = useState("");

  const [loginMsg, setLoginMsg] = useState("");

  function handleLogin() {
    console.log("username:", inputUserName);
    console.log("password:", inputPassWord);

    setLoginMsg("");

    // loging error msg testing
    if (!inputUserName) {
      console.log("login fail : invalid username");
      setLoginMsg(`error: invalid username`);
      return;
    }
    if (inputUserName === "ywang2" && inputPassWord !== "12345") {
      console.log("login fail : wrong password");
      setLoginMsg(`user: ${inputUserName} wrong password`);
      return;
    }

    setUserName(inputUserName);
    setPassWord(inputPassWord);
    setIsLogin(true);
    console.log("login success");
    // clear the input boxes
    setInputUserName("");
    setInputPassWord("");
  }

  function handleLogout() {
    console.log("logout success");
    setLoginMsg("");
    setUserName("");
    setPassWord("");
    setIsLogin(false);
    setInputUserName("");
    setInputPassWord("");
  }
  const fontSize =
  userName.length > 22
    ? 18
    : userName.length > 15
    ? 23
    : 32;

  return (
    <>
    {!isLogin && (
      <>
        <input
          className="text_box anim-poppop"
          type="email"
          placeholder="username"
          value={inputUserName}
          onChange={(e) => setInputUserName(e.target.value)}
          style={{
            width: 360,
            position: "absolute",
            left: 500,
            top: 500,
            zIndex: 50,
            animationDelay: "1.2s",
          }}
        />
        <input
          className="text_box anim-poppop"
          type="password"
          placeholder="password"
          value={inputPassWord}
          onChange={(e) => setInputPassWord(e.target.value)}
          style={{
            width: 290,
            position: "absolute",
            left: 500,
            top: 560,
            zIndex: 50,
            animationDelay: "1.3s",
          }}
        />
        <button
          className="button_go anim-poppop"
          style={{ position: "absolute", left: 800, top: 560, zIndex: 51, animationDelay: "1.6s" }}
          onClick={handleLogin}
        >
          <img src="assets_home/arrow_r.svg" style={{ width: 36 }} />
        </button>

        <div id="loginMsg" className="msg" style={{ display: loginMsg ? "block" : "none" }}>
          {loginMsg}
        </div>
      </>
    )}

    {isLogin && (
      <div
        className="welcome anim-poppop">
          <p style={{position: "absolute", left: 35, top: -14, fontWeight: 900, fontSize: 24, lineHeight: "26px", color: "#1d1d1b"}}>
            Hello!<br />
            <span
              style={{
                display: "inline-block",
                maxWidth: "250px",
                height: 40,
                fontSize: fontSize,
                color: "#094f39",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={userName}
            >
              {userName}
            </span>
          </p>
          <img
            src="assets_home/quit.svg"
            className="quit-btn"
            onClick={handleLogout}
          />
      </div>
    )}
    </>
  );
}
