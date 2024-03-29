import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { ToastContainer, toast } from "react-toastify";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast.error("Sign up failed. Please try again.",);
        
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast.error("Something went wrong. Please login your new account");
        
        navigate("/verify");
        
        return;
      }
      // const verificationUrl = 'https://localhost:5173/verify';
      // if (newUser) {
      //   await sendVerificationEmail(verificationUrl);
      //   navigate("/verify");
      // } else {
      //   toast({ title: "Sign up failed. Please try again." });
      // }
      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast.error("Login failed. Please try again.");
        
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex justify-center gap-5">
          <img 
            src="/assets/images/logo.svg" 
            alt="logo"  
            width={120}
            height={40}/>
          <img 
            src="/assets/icons/Logo-text.svg" 
            alt="logo-text"
            width={150}
            height={40}
            />
        </div>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent h-30 rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent h-30 rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent h-30 rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" {...field} />
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
                  <Input type="password" className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent h-30 rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
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
          pauseOnHover />
    </Form>
  );
};

export default SignupForm;
