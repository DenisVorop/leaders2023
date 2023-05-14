import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useNotify } from "@/services/notification/zustand";
import { useForgotMutation } from "@/services/auth/api";
import AuthLayout from "../../../layouts/auth";

const RestorePassword = () => {
  const methods = useForm({ mode: "onBlur" });
  const [notify] = useNotify();

  const [restore, { isSuccess, isError, isLoading }] = useForgotMutation()

  const error = useMemo(
    () =>
      Object.entries(methods?.formState?.errors)?.length === 0 ? [1] : [0],
    [methods?.formState?.errors]
  );

  useEffect(() => {
    if (isSuccess) {
      notify({
        delay: 2000,
        type: "success",
        content: () => <div className="text-green-500">reset_link_to_email</div>
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      notify({
        delay: 2000,
        type: "success",
        content: () => <div className="text-red-500">approve.error</div>
      })
    }
  }, [isError])

  const submitHandler = async (e) => {
    const credentials = {
      email: e.email,
    };

    if (!error.includes(0)) {
      restore(credentials);

    } else {

    }
  };

  return (
    <div className="my-6 ">
      <div className="w-full mx-auto order-1 lg:order-2 border-[1px] border-blue rounded-[12px] shadow-main p-4 sm:p-8 max-w-md">
        <h3
          className={
            "text-xl sm:text-xl xl:text-2xl font-bold mb-4 sm:mb-6 xl:mb-[30px]"
          }
        >
          <span
            className={
              "text-transparent bg-clip-text bg-gradient-to-br from-text-from to-text-to"
            }
          >
            reset
          </span>
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitHandler)} className="flex flex-col gap-6">
            <div>
              <input
                type="text"
                placeholder={"email"}
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

            <div className="w-full flex flex-col w-full">
              <button
                type="submit"
                className=""
              >
                {isLoading ? "loading..." : "toReset"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default RestorePassword;
RestorePassword.getLayout = page => <AuthLayout>{page}</AuthLayout>



