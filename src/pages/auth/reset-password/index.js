import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { FormProvider, useForm } from "react-hook-form";
import { useResetPassMutation } from "@/services/auth/api";
import { useNotify } from "@/services/notification/zustand";

const ResetPassword = ({ token }) => {
  const router = useRouter();
  const methods = useForm({ mode: "onBlur" });
  const [notify] = useNotify();
  const [reset, { isSuccess, isError, isLoading }] = useResetPassMutation();

  const error = useMemo(
    () =>
      Object.entries(methods?.formState?.errors)?.length === 0 ? [1] : [0],
    [methods?.formState?.errors]
  );

  useEffect(() => {
    if (isSuccess) {
      notify({
        type: "success",
        delay: 2000,
        content: () => <div className="text-green-500">password_is_changed</div>,
      });
      router.push("/auth/login")
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (isError) {
      notify({
        type: "danger",
        delay: 2000,
        content: () => (
          <div className="text-red-500">approve_error</div>
        ),
      });
    }
  }, [isError]);

  const submitHandler = async (e) => {
    const credentials = {
      password: e.password,
      token: token,
    };

    if (!error.includes(0)) {
      try {
        await reset(credentials).unwrap();
      } catch (e) {
        if (e.data.message === "Reset password bad token.") {
          notify({
            delay: 2000,
            type: "danger",
            content: () => (
              <div className="text-red-500">error reset</div>
            ),
          });
        }
      }
    } else {
    }
  };

  const [show, setShow] = useState(false);

  return (
    <div className="">
      <div className="">
        <h3>titleChangePass</h3>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder={"new-password"}
                  {...methods.register("password", {
                    required: true,
                  })}
                />
                <div
                  onClick={() => setShow(!show)}
                >
                  {!show ? "glazik": "ne glazik"}
                </div>
              </div>
              {methods.formState.errors?.password && (
                <p className="">
                  {methods.formState.errors?.password?.message}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col w-full">
              <button
                type="submit"
              >
                {isLoading ? "loading..." : "changePass"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const token = ctx.query.code;

  return {
    props: {
      token
    }
  };
};

export default ResetPassword;
