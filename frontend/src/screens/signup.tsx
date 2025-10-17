import { RiLock2Fill } from "react-icons/ri";
import Input from "../components/input";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { useUserStore } from "../hooks/useUserStore";
import chessboardImg from "../assets/chessboard.png";

const Signup = () => {
    const  SERVER_PATH  = import.meta.env.VITE_SERVER_PATH
    const [formData, setformData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setformData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    async function onSubmit() {
        try {
            const url = `${SERVER_PATH}/api/signup`;
            const post = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const getuser = await post.json();
            if (!getuser) return;
            setUser(getuser);
            navigate("/game/online");
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="w-full h-screen overflow-y-auto grid grid-cols-2 py-12 px-8 md:gap-12 lg:gap-0 ">
            <div className="w-full hidden md:block col-span-1">
                <div className=" w-full  h-full flex flex-col items-center pt-4">
                    <div className=" w-full lg:w-[80%]">
                        <img
                            className="w-full h-full"
                            draggable={false}
                            src={chessboardImg}
                            alt="chessboard"
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-2 md:col-span-1 w-full h-full text-white flex flex-col items-center">
                <div className="w-full sm:w-[75%] md:w-full lg:w-[70%] flex flex-col items-center  justify-start gap-16">
                    <div className="w-full  text-white flex flex-col items-center gap-3">
                        <div className=" text-4xl capitalize font-bold leading-none">
                            Join Now
                        </div>
                        <div className=" text-lg font-semibold leading-none">
                            and start playing chess!
                        </div>
                    </div>
                    <div className=" w-full flex flex-col gap-4">
                        <Input
                            name="username"
                            type="text"
                            handleChange={handleChange}
                            value={formData.username}
                        >
                            <FaUser />
                        </Input>
                        <Input
                            name="email"
                            type="email"
                            handleChange={handleChange}
                            value={formData.email}
                        >
                            <MdEmail />
                        </Input>
                        <Input
                            name="password"
                            type="password"
                            handleChange={handleChange}
                            value={formData.password}
                        >
                            <RiLock2Fill />
                        </Input>
                    </div>
                    <button
                        className="w-full flex flex-col items-start  overflow-hidden  bg-[#416e38]  h-20 rounded-2xl text-white  font-bold text-2xl leading-none capitalize"
                        onClick={onSubmit}
                    >
                        <div
                            className=" capitalize hover:bg-[#a1ce5f] bg-[#81b64c] w-full rounded-2xl flex flex-col justify-center items-center "
                            style={{ height: "calc(100% - 4px)" }}
                        >
                            sign up
                        </div>
                    </button>

                    <Link to={"/login"}>
                        <div className=" text-[#CCCCCC] font-medium text-base cursor-pointer text-center">
                            Already have an account?
                            <span className=" capitalize underline pl-1">Log in</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
