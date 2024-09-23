import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button, useToast, Text } from "@chakra-ui/react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { GoogleLogin } from "../services/AuthServices";

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

      const { displayName: name, email } = resultsFromGoogle.user;

      const res = await GoogleLogin(name, email);
      const data = res.data;

      if (res.status === 200) {
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
        colorScheme="blackAlpha"
        onClick={handleGoogleClick}
        mt={2}
      >
        <FcGoogle />
        <Text ml={2} textAlign="center">
          Sign in with Google
        </Text>
      </Button>
    </div>
  );
}

export default SignInWithGoogle;
