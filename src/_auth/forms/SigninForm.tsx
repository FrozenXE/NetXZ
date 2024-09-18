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
