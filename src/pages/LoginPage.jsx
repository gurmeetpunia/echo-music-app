import useLogin from "../hooks/useLogin";
import Screenshot from "../img/screenshot.webp";

const LoginPage = () => {
  const login = useLogin();

  const handleLogin = () => {
    login.mutate();
  };

  return (
    <div className="gradient-background h-dvh md:grid md:grid-cols-2 ">
      <div className="h-full overflow-hidden md:block hidden ">
        <img
          src={Screenshot}
          className="object-cover object-right h-full"
          alt="App Screenshot"
        />
      </div>
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-white font-semibold text-2xl md:text-4xl lg:text-5xl xl:text-8xl">
          Welcome
        </h1>
        <p className="text-white mb-8 text-base md:text-xl lg:text-2xl xl:text-4xl">
          to <span className="font-semibold">Echo</span> |{" "}
          <span className="text-green-500 font-semibold">Spotify</span> Clone
        </p>
        <button
          type="button"
          title="Login"
          className="text-white text-sm md:text-base lg:text-xl p-3 rounded-2xl bg-green-600 hover:bg-green-700 shadow-md"
          onClick={() => handleLogin()}
        >
          {login.isLoading ? "Loading..." : "Take me in !"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
