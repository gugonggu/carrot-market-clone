"use client";

import { smsLogin } from "@/app/(auth)/sms/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";

const initialState = {
  token: false,
  error: undefined,
};

const SMSLogin = () => {
  const [state, action] = useActionState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state?.token ? (
          <Input
            name="token"
            type="number"
            placeholder="Verification code"
            required
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            required
            errors={state?.error?.formErrors}
          />
        )}
        <Button text={state?.token ? "토큰 인증하기" : "인증 문자 보내기"} />
      </form>
    </div>
  );
};
export default SMSLogin;
