import { Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
// import useUser from "../context/useUser";


export default function Login() {
  const navigate = useNavigate();

  // const { user, setUser } = useUser();

  // if (user) {
  //   return <Navigate to="/" />;
  // }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });

      // ✅ success
      if (res.status === 1) {
        localStorage.setItem("token", res.token);

        // setUser(res.user);   
        navigate("/");
      }
    } catch (error) {
      // ❌ THIS is where "User not found" comes
      const message = error.response?.data?.message || "Something went wrong";

      alert(message); // 👈 THIS shows "User not found"
    }
  };
  return (
    <div className="justify-center flex min-h-screen bg-gray-50 text-gray-900">
      {/* Left Column: Form Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo / Heading */}
          <div className="mb-10 text-center md:text-left">
            <span className="text-2xl font-black tracking-tight text-blue-600">
              Btwits
            </span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              New here?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
              >
                Create an account
              </span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:outline-none"
              />
            </div>

            {/* Remember Me */}
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-600 select-none">
                Remember me for 30 days
              </label>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-98"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-gray-50 px-3 text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Sign-In */}
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-xs transition-all hover:bg-gray-50 active:scale-98">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              xmlns="http://w3.org"
            >
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path
                  d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4c0,-0.34 -0.03,-0.67 -0.08,-1Z"
                  fill="#4285f4"
                />
                <path
                  d="M12,20.65c2.34,0 4.3,-0.77 5.74,-2.1l-3.3,-2.6c-0.9,0.6 -2.07,0.98 -3.34,0.98 -2.56,0 -4.73,-1.73 -5.5,-4.06H2.2v2.7c1.44,2.87 4.43,4.83 7.8,4.83Z"
                  fill="#34a853"
                />
                <path
                  d="M6.5,12.87c-0.2,-0.6 -0.31,-1.24 -0.31,-1.9s0.11,-1.3 0.31,-1.9V6.4H2.2c-0.67,1.34 -1.06,2.85 -1.06,4.47s0.39,3.13 1.06,4.47l4.3,-3.37Z"
                  fill="#fbbc05"
                />
                <path
                  d="M12,5.77c1.27,0 2.42,0.44 3.32,1.3l2.5,-2.5C16.3,3.18 14.34,2.35 12,2.35c-3.37,0 -6.36,1.96 -7.8,4.83l4.3,3.37c0.77,-2.33 2.94,-4.06 5.5,-4.06Z"
                  fill="#ea4335"
                />
              </g>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
