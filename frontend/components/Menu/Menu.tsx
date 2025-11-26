import { Button } from "@chakra-ui/react";
import Search from "../Search/Search";
import { RiMailLine } from "react-icons/ri";

const Menu = () => {
    return (
        <div className="flex justify-between !py-8 !px-15 bg-white !text-black">
            <div className="flex gap-15 items-center">
                <div>
                    <h1 className="!text-2xl font-bolder">Juvino Tech</h1>
                </div>
                <div>
                    <nav>
                        <ul className="flex gap-8 text-gray-800">
                            <li>
                                Categorias
                            </li>
                            <li>
                                Tutoriais
                            </li>
                            <li>
                                Sobre
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="flex gap-8">
                <Search/>
                <Button className="!bg-black !text-white" variant="solid">
                    <RiMailLine className="!text-white" /> Login
                </Button>
            </div>
        </div>
    );   
}

export default Menu;