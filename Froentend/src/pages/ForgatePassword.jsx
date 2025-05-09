import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ validation schema
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const ForgotPassword = () => {
  return (
    <div className="bg-sky-100 min-h-screen py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-center text-2xl font-semibold mb-6">
              forgot Password
            </h2>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "http://localhost:9000/forgot-password",
                    values
                  );

                  Swal.fire({
                    icon: "success",
                    title: "Email Sent",
                    text:
                      response.data.message ||
                      "Check your inbox for reset instructions.",
                    timer: 2000,
                    showConfirmButton: false,
                  });

                  resetForm();
                } catch (error) {
                  console.error(
                    "Forgot password error:",
                    error.response?.data || error.message
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text:
                      error.response?.data?.message ||
                      "Failed to send reset link",
                    showConfirmButton: true,
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-6">
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="email"
                    >
                      email Address
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

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>

                  <div className="text-center mt-4 text-sm">
                    Remember your password?{" "}
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

export default ForgotPassword;
