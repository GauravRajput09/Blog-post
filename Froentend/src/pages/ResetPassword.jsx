import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// validation schema
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  confirmpassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      console.log("Using token:", token);

      const response = await axios.post(
        `http://localhost:9000/reset-password/${token}`,
        {
          password: values.password,
          confirmpassword: values.confirmpassword,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text:
          response.data.message || "You can now log in with your new password.",
        timer: 3000,
        showConfirmButton: false,
      });
      resetForm();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text:
          error.response?.data?.message ||
          "Invalid or expired token. Please request a new password reset link.",
        showConfirmButton: true,
      });
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sky-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <Formik
          initialValues={{ password: "", confirmpassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  New Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
                  placeholder="Enter new password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmpassword"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
                  placeholder="Confirm new password"
                />
                <ErrorMessage
                  name="confirmpassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSubmitting || isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    reseting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
