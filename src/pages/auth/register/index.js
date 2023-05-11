
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router";
import Link from "next/link";

import { FormProvider, useForm } from "react-hook-form";
import { useNotify } from "@/services/notification/zustand";
import { useSignupMutation } from "@/services/auth/api";

const Register = () => {
  const router = useRouter()
  const [signup, { isSuccess, isError }] = useSignupMutation()
  const methods = useForm({ mode: "onBlur" });
  const [notify] = useNotify()

  const error = useMemo(
    () =>
      Object.entries(methods?.formState?.errors)?.length === 0 ? [1] : [0],
    [methods?.formState?.errors]
  );

  useEffect(() => {
    if (isSuccess) {
      notify({ delay: 2000, type: "success", content: () => <div className="text-green-500">signin</div> })
      router.push('/auth/login')
    }
  }, [isSuccess, router])

  useEffect(() => {
    if (isError) {
      notify({ delay: 2000, type: "danger", content: () => <div className="text-red-500">invalidAuth</div> })
    }
  }, [isError])

  const submitHandler = async (e) => {
    if (e.password !== e.new_password_repeat) {
      notify({ delay: 2000, type: "danger", content: () => <div className="text-red-500">mismatch</div> })
      return
    }
    const credentials = {
      email: e.email,
      password: e.password
    };

    if (!error.includes(0)) {
      signup(credentials)
    } else {

    }
  };

  const [show, setShow] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)

  return (
    <div className="">
      <div className="">
        <h1>signup</h1>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitHandler)} className="flex flex-col gap-6">
            <div>
              <input

                type="text"
                placeholder="email"
                {...methods.register("email", {
                  required: true,
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
                <div className="" onClick={() => setShow(!show)}>
                  {!show ? "glazik" : "glazik"}
                </div>
              </div>
              {methods.formState.errors?.password && (
                <p className="">
                  {methods.formState.errors?.password?.message}
                </p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={!showRepeat ? "password" : "text"}
                  placeholder={"password-approve"}
                  {...methods.register("new_password_repeat", {
                    required: true,
                  })}
                />
                <div onClick={() => setShowRepeat(!showRepeat)}>
                  {!showRepeat ? "glazok" : "ne glazok"}
                </div>
              </div>
              {methods.formState.errors?.new_password_repeat && (
                <p>
                  {methods.formState.errors?.new_password_repeat?.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col w-full">
              <button
                type="submit"
              >
                toSignUp
              </button>
              <div className="">
                <span>signupBridge</span>
                <Link href="/auth/login/">
                  <span>toLogin</span>
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};


export default Register;
