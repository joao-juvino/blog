import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="!mt-20 !p-10 bg-white !text-black flex justify-around">
            <div>
                <p>Autor: <span className="!italic">@João Juvino</span></p>
            </div>
            <div className="flex !text-2xl gap-5">
                <FaGithub />
                <BiLogoInstagramAlt />
                <FaLinkedin />
            </div>
        </div>
    );
}


export default Footer;