import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";

const SocialLogin = () => {
  return (
    <>
      <div className="w-full h-px bg-neutral-500" />
      <div className="flex flex-col gap-3">
        <Link
          className="flex items-center justify-center h-10 gap-3 primary-btn"
          href="/gitgub/start"
        >
          <span>
            <FaGithub className="size-6" />
          </span>
          <span>Continue with Github</span>
        </Link>
        <Link
          className="flex items-center justify-center h-10 gap-3 primary-btn"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
          </span>
          <span>Continue with SMS</span>
        </Link>
      </div>
    </>
  );
};
export default SocialLogin;
