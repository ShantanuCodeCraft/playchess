import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./useUserStore";

const useUser = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserStore();
    const SERVER_PATH = import.meta.env.VITE_SERVER_PATH;
    
    useEffect(() => {
        if (!user) {
            (async function Getuser() {
                try {
                    const url = `${SERVER_PATH}api/refresh/user`;
                    const responce = await fetch(url, {
                        method: "GET",
                        credentials: "include",
                    });
                    const data = await responce.json();

                    if (!data) {
                        return navigate("/");
                    }
                    setUser(data);
                } catch {
                    navigate("/login");
                }
            })();
        }
    }, [user, setUser, navigate]);

    return user
}

export default useUser;