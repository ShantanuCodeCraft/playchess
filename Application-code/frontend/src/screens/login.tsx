import { FaUser } from "react-icons/fa6";
import Input from "../components/input";
import { RiLock2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { useUserStore } from "../hooks/useUserStore";
import ChessboardImg from "../assets/chessboard.png";

const Login2 = () => {
    const { setUser, user } = useUserStore();
    const navigate = useNavigate();
    const  SERVER_PATH = import.meta.env.VITE_SERVER_PATH ;

    async function LoginAsGuest() {
        const url = `${SERVER_PATH}/api/guest`;
        const Responce = await fetch(url, {
            method : "GET",
            credentials : "include"
        })
        const data = await Responce.json();
        if (!data) return;
        setUser(data); 
        navigate("/game/online");
    }

    const [formData, setformData] = useState({
        username: "",
        password: "",
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const url = `${SERVER_PATH}/api/login`;
        const responce = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await responce.json();
        if (!data) return;
        setUser(data);
        setformData({ username: "", password: "" });
        navigate("/game/online");
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setformData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    return (
        <form
            className="w-full h-screen overflow-y-auto grid grid-cols-2 py-12 px-8 md:gap-12 lg:gap-0"
            onSubmit={handleSubmit}
        >
            <div className="w-full hidden md:block col-span-1">
                <div className=" w-full  h-full flex flex-col items-center pt-4">
                    <div className=" w-full lg:w-[80%]">
                        <img
                            draggable={false}
                            className=" w-full h-full"
                            src={ChessboardImg}
                            alt="chessboard"
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-2 md:col-span-1 w-full h-full text-white flex flex-col items-center">
                <div className="w-full sm:w-[65%] md:w-full lg:w-[65%] flex flex-col items-center  justify-start gap-16">
                    <div className=" text-[#ebecd0] font-bold text-4xl">
                        <span className=" text-[#739552] cap italize">play</span>Chess
                        <span className=" text-sm font-medium">.com</span>
                    </div>

                    <div className=" w-full flex flex-col gap-4">
                        <Input
                            name="username"
                            type="text"
                            value={formData.username}
                            handleChange={handleChange}
                        >
                            <FaUser />
                        </Input>
                        <Input
                            name="password"
                            type="password"
                            value={formData.password}
                            handleChange={handleChange}
                        >
                            <RiLock2Fill />
                        </Input>
                    </div>
                    <button
                        className="w-full flex flex-col items-start  overflow-hidden  bg-[#416e38]  h-20 rounded-2xl text-white  font-bold text-2xl leading-none capitalize"
                        type="submit"
                    >
                        <div
                            className=" capitalize hover:bg-[#a1ce5f] bg-[#81b64c] w-full rounded-2xl flex flex-col justify-center items-center "
                            style={{ height: "calc(100% - 4px)" }}
                        >
                            Log in
                        </div>
                    </button>

                    <Link to={"/signup"}>
                        <div className="  text-[#CCCCCC] underline cursor-pointer text-center font-medium text-base">
                            New? signup and start palying chess!
                        </div>
                    </Link>

                    {!user && (
                        <button
                            className="w-full  active:scale-95 flex flex-col items-start  overflow-hidden  bg-[#000000]  h-16 rounded-xl text-white  font-semibold text-base leading-none capitalize"
                            onClick={LoginAsGuest}
                            type="button"
                        >
                            <div
                                className=" px-3 hover:bg-[#2a2a26] bg-[#1e1e1b] w-full rounded-md flex   items-center "
                                style={{ height: "calc(100% - 4px)" }}
                            >
                                <div className=" px-4">
                                    <FaUser className=" text-base leading-none " />
                                </div>
                                play as guest
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Login2;
