import useAuthState from "@/states/AuthState"
import Link from "next/link";

const Navbar = () => {
    
    const {user, signOut} = useAuthState();

    const handleLogout = async () => { 
        await signOut();
    }

    return (
       <div className="w-screen h-[5rem] bg-blue-500 text-white">
        {
            user ? (
                <button onClick={handleLogout}>Logout</button>
            ):
            (
                <Link href="/login">Login</Link>
            )
        }
       </div>
    )
}

export default Navbar;