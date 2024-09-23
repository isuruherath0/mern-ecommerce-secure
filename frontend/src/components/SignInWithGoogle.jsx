import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@chakra-ui/react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

function SignInWithGoogle() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
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
