import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { FormProvider, useForm } from "react-hook-form";
import { useLoginMutation } from "@/services/auth/api";
import { useNotify } from "../../../services/notification/zustand";

const Login = () => {
  const [login, { isSuccess, isError, isLoading }] = useLoginMutation();
  const methods = useForm({ mode: "onBlur" });
  const [notify] = useNotify();

  const error = useMemo(
    () =>
      Object.entries(methods?.formState?.errors)?.length === 0 ? [1] : [0],
    [methods?.formState?.errors]
  );

  const submitHandler = async (e) => {
    const credentials = {
      email: e.email,
      password: e.password,
    };

    if (!error.includes(0)) {
      login(credentials);
    } else {
      //TODO
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notify({
        delay: 2000,
        type: "success",
        content: () => (
          <div className="text-green-500">success</div>
        ),
      });
      // router.push("");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      notify({
        type: 'danger',
        delay: 3000,
        content: () => (
          <div className="text-red-500">invalid auth</div>
        ),
      });
    }
  }, [isError]);

  const [show, setShow] = useState(false);

  return (
    <div className="">
      <div className="">
        <h1 className="">
          <span
            className=""
          >
            signin
          </span>
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="flex flex-col gap-6"
          >
            <div>
              <input
                type="text"
                placeholder={"email"}
                {...methods.register("email", {
                  required: true,
                  // pattern: {
                  //   value: validation.email,
                  //   message: text.auth["f-email-message"],
                  // },
                })}
              />
              {methods.formState.errors?.email && (
                <p className="">
                  {methods.formState.errors?.email?.message}
                </p>
              )}
            </div>
            <div>
              <div className="relative">
                <input

                  type={show ? "text" : "password"}
                  placeholder={"password"}
                  {...methods.register("password", {
                    required: true,
                  })}
                />
                <div

                  onClick={() => setShow(!show)}
                >
                  {!show ? "glazik" : "ne glazik"}
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/auth/restore-password/">
                  <span

                  >
                    {"forgot-password"}
                  </span>
                </Link>
              </div>
            </div>

            <div className="w-full flex flex-col w-full">
              <button
                type="submit"
                className=""
                disabled={isLoading}
              >
                {isLoading ? "loading..." : "toLogin"}
              </button>
              <div

              >
                <span>signinBridge</span>
                <Link href="/auth/register/">
                  <span

                  >
                    toSignUp
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
