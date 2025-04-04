import useAuthState from "@/states/AuthState"
import Link from "next/link";

const Navbar = () => {

    const {user, signOut} = useAuthState();
    const handleLogout = async () => {
        await signOut();
    }
    return (
        <header className="bg-dark_green">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold text-light_green">TutorTrack</div>
                <ul className="flex space-x-6">
                    <li>
                        {
                            user ? (
                                    <button
                                        className="px-4 py-2 bg-bright_green text-dark_green rounded hover:bg-primary_green transition duration-300"
                                        onClick={handleLogout}>Logout</button>
                                ) :
                                (
                                    <Link href="/auth/login"
                                          className="px-4 py-2 bg-bright_green text-dark_green rounded hover:bg-primary_green transition duration-300"
                                    >Login</Link>
                                )
                        }
                    </li>
                </ul>
            </nav>
        </header>

    )
}

export default Navbar;