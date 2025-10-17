import { Link, Outlet } from "react-router-dom";
import { useUserStore } from "../hooks/useUserStore";
import { MdMenu } from "react-icons/md";

const Layout = () => {
    const { user } = useUserStore();

    //  bg-[#262522]

    return (
        <div>
            <div className=" flex flex-col gap-6 w-full h-full lg:flex-row ">
                <aside className=" w-full lg:w-44 lg:h-screen lg:bg-[#262522] relative">
                    <nav className=" h-full  p-3 flex  justify-between lg:flex-col lg:fixed">
                        <div className=" text-[#ebecd0] font-bold text-2xl">
                            <span className=" text-[#739552] capitalize">play</span>Chess
                        </div>

                        <button className=" lg:hidden pl-3">
                            <MdMenu className=" text-white text-3xl" />
                        </button>
                        {(!user || user?.isGuest) && (
                            <div className=" hidden lg:block">
                                <div className=" flex flex-col gap-2 text-sm">
                                    <Link to={"/signup"}>
                                        <button className="w-full p-3 bg-[#444444] rounded-lg font-bold capitalize text-white">
                                            sign up
                                        </button>
                                    </Link>
                                    <Link to={"/login"}>
                                        <button className=" bg-[#81b64c] w-full p-3 rounded-lg font-bold capitalize text-white">
                                            Log in
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </nav>
                </aside>
                <div className=" w-full h-full  flex  items-center justify-center">
                    <Outlet />
                </div>
                {/* <div className="  fixed inset-0 bg-[#333333] overflow-clip "></div> */}
            </div>
        </div>
    );
};

export default Layout;
