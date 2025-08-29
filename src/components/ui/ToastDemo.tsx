"use client";

import { useToast } from "../../hooks/useToast";
import { WButton } from "./WButton";

export const ToastDemo = () => {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.success("Operation completed successfully!", "Success");
  };

  const showErrorToast = () => {
    toast.error("Something went wrong. Please try again.", "Error");
  };

  const showWarningToast = () => {
    toast.warning("Please review your input before proceeding.", "Warning");
  };

  const showInfoToast = () => {
    toast.info("Here's some helpful information for you.", "Info");
  };

  const showToastWithAction = () => {
    toast.toast({
      type: "info",
      title: "New update available",
      message: "A new version of the application is available.",
      action: {
        label: "Update now",
        onClick: () => {
          console.log("Update clicked");
          toast.success("Update started!");
        },
      },
      duration: 10000, // 10 seconds
    });
  };

  const showPersistentToast = () => {
    toast.toast({
      type: "warning",
      title: "Important notice",
      message: "This toast will not auto-dismiss.",
      duration: 0, // 0 means no auto-dismiss
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Demo</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <WButton onClick={showSuccessToast} variant="success">
          Success Toast
        </WButton>

        <WButton onClick={showErrorToast} variant="danger">
          Error Toast
        </WButton>

        <WButton onClick={showWarningToast} variant="warning">
          Warning Toast
        </WButton>

        <WButton onClick={showInfoToast} variant="primary">
          Info Toast
        </WButton>

        <WButton onClick={showToastWithAction} variant="primary">
          Toast with Action
        </WButton>

        <WButton onClick={showPersistentToast} variant="warning">
          Persistent Toast
        </WButton>

        <WButton onClick={toast.clearAll} variant="secondary">
          Clear All
        </WButton>
      </div>
    </div>
  );
};
