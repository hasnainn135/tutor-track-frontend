const Login = () => {
    return (
        <>
        <div className="w-full h-screen flex flex-row">
            {/**right side*/}
            <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-center text-6xl mb-12">Login</h1>
            <form className="flex flex-col">
                <label htmlFor="username">User name</label>
                <input type="text" id="username" name="username" className="border w-80 border-[#bababa] rounded-md"/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" className="border border-[#bababa] w-80 rounded-md"/>
            </form>
            
            </div>
            {/**left side*/}
            <div className="bg-green-950 w-1/2 h-screen">
            <p>has</p>
            </div>
        </div>
        </>
    )
}
export default Login;