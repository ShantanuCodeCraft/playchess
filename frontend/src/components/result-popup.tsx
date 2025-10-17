import { useGameStore } from "../hooks/useGameStore";
import { useUserStore } from "../hooks/useUserStore";
import WhitePlayerImg from "../assets/playerAsblack.jpg";
import BlackPlayerImg from "../assets/playerAsblack.jpg";
import { RxCross2 } from "react-icons/rx";
import { IoShareSocialSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

type proptypes = {
  setshowResult: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResultPopup = ({ setshowResult }: proptypes) => {
  const { user } = useUserStore();
  const { MetaData } = useGameStore();

  const winner =
    MetaData?.result === "BLACK_WINS"
      ? MetaData.playerAsBlack
      : MetaData?.playerAsWhite;

  const navigate = useNavigate();

  return (
    <div className=" z-[3000] fixed inset-0 flex flex-col justify-center items-center bg-[#0000006c] ">
      <div className=" relative w-full max-w-xs min-h-[360px] bg-[#302e2b] rounded-md  overflow-hidden">
        <div className="  absolute top-0 w-full h-32 bg-[#363431]"></div>
        <div className=" p-2 h-full w-full flex flex-col gap-2   text-white items-center font-medium ">
          <div className="w-full z-50 flex justify-between">
            <IoShareSocialSharp className=" text-[#a29c93] text-2xl" />
            <div className=" flex flex-col   items-center">
              <h1 className=" z-50 mt-6 text-3xl bebas-neue-regular capitalize ">
                {winner === user?.username ? "you won" : "You Lose"}
              </h1>
              <p className=" text-xs uppercase font-semibold  text-[#85807a]">
                {MetaData?.status}
              </p>
            </div>

            <button
              className=" w-fit h-fit"
              onClick={() => setshowResult((prev) => !prev)}
            >
              <RxCross2 className=" text-[#a29c93] text-2xl" strokeWidth={1} />
            </button>
          </div>
          <div className="mt-2 z-50 w-full flex items-center gap-4 justify-center">
            <div className=" flex flex-col items-center justify-center w-fit h-fit gap-1">
              <div className=" w-fit h-fit border-4 rounded-md border-[#739552] overflow-hidden">
                <img
                  className=" aspect-square w-16 "
                  src={WhitePlayerImg}
                  alt="white_player"
                />
              </div>
              <p className="  text-xs">you</p>
            </div>
            <p className=" text-base bebas-neue-regular">vs</p>
            <div className=" flex flex-col items-center justify-center w-fit h-fit gap-1">
              <div className=" w-fit h-fit border-4 rounded-md border-[#272727] overflow-hidden">
                <img
                  className=" aspect-square w-16 "
                  src={BlackPlayerImg}
                  alt="white_player"
                />
              </div>
              <p className="  text-xs">opponent</p>
            </div>
          </div>
          <button className=" mt-6 hover:shadow hover:shadow-[#a1ce5f] w-3/4 flex flex-col items-start  overflow-hidden  bg-[#416e38] h-16  rounded-lg text-white   leading-none capitalize">
            <div
              className=" hover:bg-[#a1ce5f] font-bold text-lg bg-[#81b64c] w-full rounded-lg flex flex-col justify-center items-center gap-1 "
              style={{ height: "calc(100% - 6px)" }}
              onClick={() => navigate("/game/online")}
            >
              New game
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
