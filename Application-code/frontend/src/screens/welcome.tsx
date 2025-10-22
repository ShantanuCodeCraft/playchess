import { useNavigate } from "react-router-dom";
import chessboardImg  from "../assets/chessboard.png"

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className=" py-16 px-8 flex min-h-screen flex-col-reverse gap-[100px] lg:flex-row">
      <div className=" flex flex-col items-center justify-center">
        <div>
          <img
            draggable={false}
            className=" h-auto w-auto"
            src={chessboardImg}
            alt="chessboard"
          />
        </div>
      </div>

      <div className="  w-full h-full flex flex-col items-center justify-start gap-16  text-white">
        <div className=" font-bold text-5xl text-center">
          Play Chess Online on the #2 Site!
        </div>
        <div className=" w-full flex flex-col items-center gap-6">

          

          <button
            className=" hover:shadow hover:shadow-[#a1ce5f] w-3/4 flex flex-col items-start  overflow-hidden  bg-[#416e38]  h-24 rounded-lg text-white   leading-none capitalize"
            onClick={() => {
              navigate("/game/online");
            }}
          >
            <div
              className=" hover:bg-[#a1ce5f] bg-[#81b64c] w-full rounded-lg flex flex-col justify-center items-center gap-1 "
              style={{ height: "calc(100% - 6px)" }}
            >
              <div className=" font-bold  text-2xl">Play Online</div>
              <div className=" text-sm font-medium ">play with someone</div>
            </div>
          </button>

          <button
            className=" hover:shadow hover:shadow-black w-3/4 flex flex-col items-start  overflow-hidden  bg-[#000000]  h-24 rounded-lg text-white   leading-none capitalize"
            onClick={() => {
              navigate("/game/online");
            }}
          >
            <div
              className=" hover:bg-[#2a2a26] bg-[#1e1e1b] w-full rounded-lg flex flex-col justify-center items-center gap-1 "
              style={{ height: "calc(100% - 6px)" }}
            >
              <div className=" font-bold  text-2xl">Play With AI</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
