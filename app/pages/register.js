import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/register", { email, password });
      // register, redirect to login
      router.push("/");
    } catch (error) {
      if (error.response) setErrorMsg(error.response.data);
      else throw error;
    }
  };

  return (
    <div className="flex justify-center mt-9">
      <div className="bg-gray-100 rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-3 p-6 pb-5">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full max-w-xs"
            id="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input w-full max-w-xs"
            id="password"
          />
          <button type="submit" className="btn">
            Sign up
          </button>
          {errorMsg && <p className="text-red-700">{errorMsg}</p>}
        </form>
        <div className="w-full h-0.5 bg-gray-200" />
        <div className="flex justify-center p-6 pt-4 flex-col">
          <Link passHref href="/">
            <a className="text-gray-500 text-sm text-center underline cursor-pointer">
              Already have an account? Log in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
