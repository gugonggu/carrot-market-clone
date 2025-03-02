"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { login } from "@/app/login/actions";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const Login = () => {
  const [state, action] = useActionState(login, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
};
export default Login;
