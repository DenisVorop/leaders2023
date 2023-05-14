
import { useApproveMutation, useMeQuery } from "./api";
import { useRouter } from "next/router";
import { useNotify } from "../notification/zustand"
import { useEffect, useRef } from "react";

import alerts from "../../components/alerts";

const Guard = ({
  children,
  roles = [],
  verification = false,
  fallbackUrl = ""
}) => {
  const router = useRouter();
  const [notify] = useNotify()

  const [
    approve,
    {
      isSuccess: isSuccessApprove,
      isError: isErrorApprove,
      isLoading: isLoadingApprove,
    },
  ] = useApproveMutation();

  const {
    data: user,
    isSuccess,
    isError,
    isFetching,
    isLoading,
  } = useMeQuery(undefined, {
    pollingInterval: 20000,
  });

  useEffect(() => {
    if (isSuccessApprove) {
      notify({
        delay: 2000,
        type: "success",
        content: () => (

          <div className="text-green-500">send_success</div>
        ),
      });
    }
  }, [isSuccessApprove]);

  useEffect(() => {
    if (isErrorApprove) {
      notify({
        delay: 2000,
        type: "danger",
        content: () => (
          <div className="text-red-500">error</div>
        ),
      });
    }
  }, [isErrorApprove]);

  const notifyOnce = useRef(false);

  useEffect(() => {
    if (isFetching || notifyOnce.current) {
      return;
    }
    if (isError || !roles.includes(user?.role)) {
      notify({
        delay: 2000,
        type: "danger",
        content: () => (
          <alerts.Main>
            <div className="text-red-500">permission denied</div>
          </alerts.Main>
        ),
      });
      router.push("/");
      notifyOnce.current = true
    }
  }, [isError, isFetching, user, router, roles, notifyOnce]);

  return (
    <>
      <div
        className={`absolute m-auto left-0 right-0 w-fit ${isLoading ? "block" : "hidden"
          }`}
      >
        ...loading
      </div>
      <div
        className={
          verification &&
            isSuccess &&
            !!user &&
            user.role === "user" &&
            !user?.email_approved &&
            !isLoading
            ? "flex items-center flex-col gap-3"
            : "hidden"
        }
      >
        <p className="text-bold text-sm lg:text-lg ">
          title
        </p>
        <button
          onClick={approve}
          disabled={isLoadingApprove}
          className="relative w-fit inline-flex gap-3 items-center hover:opacity-80 bg-gradient-to-br from-text-from to-text-to rounded-full font-bold px-3 py-2 lg:px-4 lg:py-3"
        >
          <div className="text-sm lg:text-lg">approve</div>
        </button>
      </div>
      <div
        className={
          !(
            isSuccess &&
            !!user &&
            user?.email_approved &&
            user.role === "user"
          ) || isLoading
            ? "hidden"
            : "block"
        }
      >
        {children}
      </div>
    </>
  );
};

export default Guard;
