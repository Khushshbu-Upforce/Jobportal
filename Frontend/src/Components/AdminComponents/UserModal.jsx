import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUser, updateUser } from "../../Servises/adminApi";

const UserModal = ({
    isOpen,
    onClose,
    isEditMode,
    initialValues,
    editUserId,
    onSuccess,
}) => {
    if (!isOpen) return null;

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: !isEditMode
                ? Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
                : Yup.string(),
            role: Yup.string().oneOf(["user", "admin", "recruiter"]).required("Role is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEditMode) {
                    console.log(values, "Edit values");
                    console.log(editUserId, "Edit ID");

                    await updateUser(editUserId, values);
                } else {
                    console.log(values, "Create values");
                    await createUser(values);
                }
                onSuccess();
            } catch (error) {
                console.error("User save failed", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold mb-4">
                    {isEditMode ? "Edit User" : "Create User"}
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {formik.touched.username && formik.errors.username && (
                            <p className="text-red-500 text-sm">{formik.errors.username}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm">{formik.errors.email}</p>
                        )}
                    </div>

                    {!isEditMode && (
                        <div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className="w-full border px-3 py-2 rounded"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm">{formik.errors.password}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <select
                            name="role"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.role}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                        {formik.touched.role && formik.errors.role && (
                            <p className="text-red-500 text-sm">{formik.errors.role}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {formik.isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
