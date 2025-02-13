import React, { useState } from "react";
import {
  Shield,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  Trash2,
  User,
  Mail,
  Briefcase,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Department, Priority, DocumentType } from "../types";
import { useRequest } from "../context/RequestContext";

interface FileUpload {
  file: File;
  type: DocumentType;
  description: string;
}

interface FormErrors {
  requesterName?: string;
  requesterEmail?: string;
  requesterRole?: string;
}

export default function UserSubmissionPage() {
  const navigate = useNavigate();
  const { addRequest } = useRequest();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const requesterName = formData.get("requesterName") as string;
    const requesterEmail = formData.get("requesterEmail") as string;
    const requesterRole = formData.get("requesterRole") as string;

    if (!requesterName || requesterName.trim().length < 2) {
      newErrors.requesterName = "Name must be at least 2 characters long";
      isValid = false;
    }

    if (!requesterEmail || !validateEmail(requesterEmail)) {
      newErrors.requesterEmail = "Please enter a valid email address";
      isValid = false;
    }

    if (!requesterRole || requesterRole.trim().length < 2) {
      newErrors.requesterRole = "Please enter your role";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: DocumentType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploads((prev) => [...prev, { file, type, description: "" }]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateDescription = (index: number, description: string) => {
    setUploads((prev) =>
      prev.map((upload, i) =>
        i === index ? { ...upload, description } : upload
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = {
        title: formData.get("title") as string,
        department: formData.get("department") as Department,
        priority: formData.get("priority") as Priority,
        description: formData.get("description") as string,
        businessJustification: formData.get("businessJustification") as string,
        technicalDetails: formData.get("technicalDetails") as string,
        requesterName: formData.get("requesterName") as string,
        requesterEmail: formData.get("requesterEmail") as string,
        requesterRole: formData.get("requesterRole") as string,
        documents: uploads,
      };

      addRequest(newRequest);
      setIsSuccess(true);
      form.reset();
      setUploads([]);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Cybersecurity Request Portal
          </h1>
          <p className="text-white/70 text-center">Submit your request below</p>
        </div>

        <div className="form-card rounded-xl shadow-2xl p-8 mb-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Request Submitted
              </h2>
              <p className="text-gray-600 mb-6">
                Your request has been successfully submitted and is being
                reviewed.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center"
              >
                Submit Another Request
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Please ensure all information is accurate and attach
                    relevant documentation (HLD/LLD) before submission
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="requesterName"
                      className="block text-sm font-medium text-gray-900 mb-1"
                    >
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="requesterName"
                        name="requesterName"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors text-gray-900 ${
                          errors.requesterName
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="John"
                        required
                      />
                    </div>
                    {errors.requesterName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.requesterName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="requesterEmail"
                      className="block text-sm font-medium text-gray-900 mb-1"
                    >
                      Your Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="requesterEmail"
                        name="requesterEmail"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors text-gray-900 ${
                          errors.requesterEmail
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                    {errors.requesterEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.requesterEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="requesterRole"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Your Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="requesterRole"
                      name="requesterRole"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors text-gray-900 ${
                        errors.requesterRole
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                  {errors.requesterRole && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.requesterRole}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Request Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Brief description of your request"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-900 mb-1"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                      required
                    >
                      <option value="">Select department</option>
                      <option value="IT">IT</option>
                      <option value="HR">Networks</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-900 mb-1"
                    >
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="businessJustification"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Business Justification
                  </label>
                  <textarea
                    id="businessJustification"
                    name="businessJustification"
                    placeholder="Explain the business need for this request"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="technicalDetails"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Technical Details
                  </label>
                  <textarea
                    id="technicalDetails"
                    name="technicalDetails"
                    placeholder="Provide technical specifications or requirements"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Additional Information
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Any other relevant information about your request"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-900">
                    Documentation
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["HLD", "LLD", "SDD", "Other"].map((type) => (
                      <div key={type} className="relative">
                        <input
                          type="file"
                          id={`file-${type}`}
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, type as DocumentType)
                          }
                          accept=".pdf,.doc,.docx,.txt"
                        />
                        <label
                          htmlFor={`file-${type}`}
                          className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            Upload {type}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {uploads.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Uploaded Documents
                      </h4>
                      {uploads.map((upload, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-gray-500 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {upload.file.name}
                            </p>
                            <input
                              type="text"
                              placeholder="Add description"
                              value={upload.description}
                              onChange={(e) =>
                                handleUpdateDescription(index, e.target.value)
                              }
                              className="mt-1 w-full text-sm px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="glass-card px-8 py-6 rounded-lg inline-flex flex-col items-center">
            <p className="text-white/70 mb-4">Are you an administrator?</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="inline-flex items-center px-6 py-2 text-white hover:text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4 mr-2" />
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
