import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { ToastContainer, toast } from "react-toastify";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { z } from 'zod';

const SigninForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);
    if (!session) {
      toast.error("Login failed. Please double check your email or password.");
      return;
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/sign-in");
    } else {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="w-full flex justify-center gap-5">
          <img 
            src="/assets/images/logo.png" 
            alt="logo"  
            width={175}
            height={20}
          />
        </div>
        <h2 className="h3-bold md:h2-bold pt-2 sm:pt-5">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="py-3 px-4 block w-full border-2 border-gray-600 focus:border-cola bg-transparent rounded-md text-sm shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="py-3 px-4 block w-full border-2 border-gray-600 focus:border-cola bg-transparent rounded-md text-sm shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Link to="/reset-password" className="text-right pr flex justify-end pb-2">
              <span className="text-md text-gray-300  hover:underline hover:decoration-cola dark:text-gray-500 dark:hover:text-gray-200 cursor-pointer">
                Reset Password
              </span>
            </Link>
            <Button
              type="submit"
              className="rounded-md border border-transparent bg-ha hover:bg-primary-500 font-semibold transition-all text-md w-full"
            >
              {isLoading || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader />
                </div>
              ) : (
                "Log in"
              )}
            </Button>
          </div>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-ha hover:underline hover:decoration-primary-500 hover:text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
        <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
        <a className="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-300 decoration-2 hover:underline hover:decoration-ha dark:text-gray-500 dark:hover:text-gray-200" href="https://github.com/frozenxe" target="_blank">
          <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View Github
        </a>
        <a className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-300 decoration-2 hover:underline hover:decoration-ha dark:text-gray-500 dark:hover:text-gray-200" href="https://zeroxe.dev">
          About Creator
        </a>
      </p>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Form>
  );
};

export default SigninForm;
