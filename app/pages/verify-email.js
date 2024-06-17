import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function VerifyEmail() {
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const [verifyErrorMsg, setVerifyErrorMsg] = useState("");

  const router = useRouter();

  const onSubmitVerify = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/verify-email", { email, code });
      router.push("/dashboard");
    } catch (error) {
      if (error.response) setVerifyErrorMsg(error.response.data);
      else throw error;
    }
  };

  return (
    <div className="flex justify-center mt-9">
      <div className="bg-gray-100 rounded-md">
        <form onSubmit={onSubmitVerify} className="flex flex-col space-y-3 p-6 pt-0">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full max-w-xs"
            id="email"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
            className="input w-full max-w-xs"
            id="code"
          />
          <button type="submit" className="btn">
            Confirm
          </button>
          {verifyErrorMsg && <p className="text-red-700 max-w-xs">{verifyErrorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
