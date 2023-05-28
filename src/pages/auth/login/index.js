import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { FormProvider, useForm } from "react-hook-form";
import { useLoginMutation } from "@/services/auth/api";
import { useNotify } from "../../../services/notification/zustand";


import { useRouter } from "next/router";
import AuthLayout from "../../../layouts/auth";

const Login = () => {
    const [login, { isSuccess, isError, isLoading }] = useLoginMutation();
    const router = useRouter();
    const methods = useForm({ mode: "onBlur" });
    const [notify] = useNotify();

    const error = useMemo(
        () =>
            Object.entries(methods?.formState?.errors)?.length === 0 ? [1] : [0],
        [methods?.formState?.errors]
    );

    const submitHandler = async (e) => {
        const credentials = {
            email: e.email.toLowerCase(),
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
            router.push("/dashboard/");
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


    return (

        <div className="card w-full md:w-[480px]">
            <h2 className="card__header">
                Войти в <span className="text-purple-600  font-bold">mycareer.fun</span>
            </h2>

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(submitHandler)}
                    className="mt-8 space-y-6"
                >
                    <div>
                        <label for="email" className="label">Электронная почта</label>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            </div>
                            <input
                                className="input pl-10"
                                type="text"
                                id="email"
                                placeholder={"email"}
                                {...methods.register("email", {
                                    required: true,
                                })}
                            />
                        </div>

                        {methods.formState.errors?.email && (
                            <p className="">
                                {methods.formState.errors?.email?.message}
                            </p>
                        )}
                    </div>


                    <div className="relative">
                        <label for="email" className="label">Ваш пароль</label>
                        <input
                            className="input"
                            type={"password"}
                            placeholder={"password"}
                            {...methods.register("password", {
                                required: true,
                            })}
                        />
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="remember" ariaDescribedby="remember" name="remember" type="checkbox" className="input" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label for="remember" className="font-medium text-gray-500 dark:text-gray-400">Запомнить меня</label>
                        </div>
                        <span className="ml-auto text-sm link md:text-base">
                            <Link href="/auth/restore-password/">
                                Забыли пароль?
                            </Link>
                        </span>
                    </div>
                    <button disabled={isLoading} type="submit" className="button">Войти в аккаунт</button>

                    <div className="text-sm font-medium text-gray-900 dark:text-white">

                        Еще не зарегистрирован? <Link href="/auth/register" >

                            <span className="link">  Создать аккаунт</span>
                        </Link>
                    </div>
                </form>
            </FormProvider>
        </div>
    );

};

export default Login;

Login.getLayout = page => <AuthLayout>{page}</AuthLayout>
