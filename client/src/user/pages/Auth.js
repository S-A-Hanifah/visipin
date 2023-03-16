import { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/form";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

export default function Auth() {
  const auth = useContext(AuthContext);

  const [isLogIn, setisLogIn] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmit = async (e) => {
    e.preventDefault();

    if (isLogIn) {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_URL}api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.logIn(response.user, response.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const response = await sendRequest(
          `${process.env.REACT_APP_URL}api/users/signup`,
          "POST",
          formData
        );

        auth.logIn(response.user.id, response.token);
      } catch (error) {}
    }
  };

  const switchAuth = () => {
    if (!isLogIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setisLogIn(!isLogIn);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLogIn ? "Login" : "Sign Up"}</h2>
        <hr />
        <form onSubmit={authSubmit}>
          {!isLogIn && (
            <Input
              element="input"
              id="name"
              type="text"
              label="name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name Require"
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please Enter a valid Email Address"
            onInput={inputHandler}
          />
          {!isLogIn && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Image Please"
            />
          )}
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Password must be at leasat 8 characters "
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogIn ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p>
          {isLogIn ? "Don't Have an Account ? " : "Welcome back ! "}
          <span onClick={switchAuth} className="pathway">
            {isLogIn ? "Sign up" : "Log In"}
          </span>
        </p>
      </Card>
    </>
  );
}
