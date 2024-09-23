import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button, useToast } from "@chakra-ui/react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

function SignInWithGoogle() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { setCurrentUser } = useUserContext();
  const toast = useToast();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("http://localhost:4000/users/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Sign In With Google Success");
        setCurrentUser(data.currentUser._id);
        toast({
          title: "Logged in.",
          description: "You have successfully logged in.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <Button
        width="100%"
        variant="solid"
        colorScheme="teal"
        onClick={handleGoogleClick}
        mt={2}
      >
        <FcGoogle />
        Sign in with Google
      </Button>
    </div>
  );
}

export default SignInWithGoogle;
