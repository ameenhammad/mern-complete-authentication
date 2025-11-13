import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AuthToggle() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  const [slideToLogin, setSlideToLogin] = useState(isLogin);

  // whenever route changes → update slider position
  useEffect(() => {
    setSlideToLogin(isLogin);
  }, [isLogin]);

  const handleClick = (target) => {
    // play animation first
    setSlideToLogin(target === "login");

    // then navigate after animation finishes (300ms)
    setTimeout(() => {
      navigate(target === "login" ? "/login" : "/signup");
    }, 300);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative bg-gray-200 w-64 h-12 rounded-full flex items-center p-1 shadow-inner overflow-hidden">
        <div
          className={`absolute left-0 top-1 bottom-1 w-1/2 rounded-full bg-blue-500
            transition-transform duration-300 ease-out
            ${slideToLogin ? "translate-x-0" : "translate-x-full"}`}
        />

        <button
          onClick={() => handleClick("login")}
          className={`relative z-10 flex-1 text-center font-semibold transition-colors duration-300
            ${slideToLogin ? "text-white" : "text-gray-700"}`}
        >
          Login
        </button>

        <button
          onClick={() => handleClick("signup")}
          className={`relative z-10 flex-1 text-center font-semibold transition-colors duration-300
            ${!slideToLogin ? "text-white" : "text-gray-700"}`}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default AuthToggle;
