import { ChangeEvent, useState } from "react";

type propTypes = {
    children: React.ReactNode;
    name: string;
    type: string;
    handleChange : (e: ChangeEvent<HTMLInputElement>) => void;
    value : string
};
const Input = ({ children, name, type,handleChange ,value}: propTypes) => {
    const [active, setactive] = useState(false);
    return (
        <div className="  bg-neutral-700 border border-[#747474] rounded-sm flex">
            <div className=" p-3 text-lg text-[#AAAAAA]">{children}</div>
            <div className=" w-full  relative py-3  text-base text-white">
                <input
                id={name}
                    onChange={(e) => { 
                        setactive(true)
                        handleChange(e)
                    }}
                    onBlur={() =>{ 
                        if (value) return;
                        setactive(false)
                    }}
                    className=" absolute inset-0  bg-transparent outline-none"
                    type={type}
                    value={value}
                />
                {!active && (
                    <div className=" text-[#AAAAAA]  leading-none capitalize">{name}</div>
                )}
            </div>
        </div>
    );
};

export default Input;
