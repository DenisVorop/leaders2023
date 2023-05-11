import { useEffect } from "react";
import Link from "next/link";
import { useConfirmQuery, useMeQuery } from "@/services/auth/api";


const ApproveEmailPage = ({ code }) => {
  const { isSuccess, isError, isFetching } = useConfirmQuery(code);
  const { isSuccess: isSuccessMe } = useMeQuery(undefined, {
    skip: !isSuccess
  })

  useEffect(() => {
    if (isSuccessMe) {
  		// router.push("")
    }
  }, [isSuccessMe]);

  return (
    <div className="relative flex flex-col align-center justify-center h-full">
      {isFetching ? (
        <div className="absolute m-auto left-0 right-0 w-fit">
          <div>loading...</div>
        </div>
      ) : (
        <div className="mx-auto block">
          {isError && 
            <div className="flex items-center space-x-4">
              error
            </div>
          }
          {isSuccess && (
            <div className="flex items-center space-x-4">
              success
            </div>
          )}
          {isSuccess ? (
            <Link href="/">
              <span className="text-transparent hover:opacity-80 bg-clip-text bg-gradient-to-br from-text-from to-text-to">
                login
              </span>{" "}
              :
            </Link>
          ) : (
            <Link href="/">
              <span className="text-transparent hover:opacity-80 bg-clip-text bg-gradient-to-br from-text-from to-text-to">
                fallback
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const code = ctx.query?.code;
  if (!code) {
    return {
      notFound: true,
    };
  }
  const props = {
    code,
  };
  return {
    props,
  };
};

export default ApproveEmailPage;
