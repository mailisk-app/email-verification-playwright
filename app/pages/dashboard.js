import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex justify-center mt-9">
      <div className="flex flex-col space-y-4">
        <p>Logged in. You're in the dashboard!</p>
        <Link passHref href="/">
          <a className="btn">Back to log in</a>
        </Link>
      </div>
    </div>
  );
}
