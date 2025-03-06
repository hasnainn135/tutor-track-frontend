import AuthLayout from "@/layouts/AuthLayout";

const Login = () => {
  return (
    <>
      <AuthLayout>
        <h1 className="font-bold text-center text-6xl mb-12">Login</h1>
        <form className="flex flex-col">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            id="username"
            name="username"
            className="border w-80 border-[#bababa] rounded-md"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border border-[#bababa] w-80 rounded-md"
          />
        </form>
      </AuthLayout>
    </>
  );
};
export default Login;