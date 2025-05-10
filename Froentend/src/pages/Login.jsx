import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

// validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-sky-100 min-h-screen py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "http://localhost:9000/login",
                    values
                  );

                  Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: response.data.message || "Welcome back!",
                    timer: 2000,
                    showConfirmButton: false,
                  });

                  resetForm();
                  // Redirect after login success (adjust route as needed)
                  navigate("/dashboard");
                } catch (error) {
                  console.error(
                    "Login error:",
                    error.response?.data || error.message
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text:
                      error.response?.data?.message ||
                      "Invalid email or password",
                    showConfirmButton: true,
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <div className="text-center mt-4 text-sm">
                    dont have an account?{" "}
                    <Link to="/signup" className="text-blue-500">
                      Sign up here
                    </Link>
                  </div>
                  <div className="text-center mt-4 text-sm">
                    <Link to="/forgotpassword" className="text-blue-500">
                      Forgot Password?
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
