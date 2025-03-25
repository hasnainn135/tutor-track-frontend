import {useRouter} from "next/router";
import Navbar from "@/components/Navbar";

const NavbarWrapper = () => {

    const router = useRouter();

    if (router.pathname === "/") {
        return (
            <Navbar/>
        )
    } else {
        return null
    }

}

export default NavbarWrapper;