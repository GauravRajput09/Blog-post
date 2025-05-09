import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Validation schema
const signupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must have at least 6 characters"),
  confirmpassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Signup = () => {
  return (
    <div className="bg-sky-100 min-h-screen py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Create an Account
            </h2>

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmpassword: "",
              }}
              validationSchema={signupSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  const { name, email, password, confirmpassword } = values;
                  const response = await axios.post(
                    "http://localhost:9000/signup",
                    {
                      name,
                      email,
                      password,
                      confirmpassword,
                    }
                  );
                  console.log("response", response.data);
                  Swal.fire({
                    icon: "success",
                    title: "Signup Successful",
                    text: response.data.message,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 2000,
                  });
                  resetForm();
                } catch (error) {
                  console.error(
                    "Signup error:",
                    error.response?.data || error.message
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Signup Failed",
                    text: error.response?.data?.message || "Signup failed",
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
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

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

                  <div className="mb-4">
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
                      placeholder="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="confirmpassword"
                    >
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmpassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="password"
                    />
                    <ErrorMessage
                      name="confirmpassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </button>

                  <div className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                      Login here
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

export default Signup;
