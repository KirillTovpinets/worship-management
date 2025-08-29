# Notification Service

A comprehensive toast notification system for the worship management application.

## Features

- **Multiple Toast Types**: Success, Error, Warning, and Info
- **Customizable Duration**: Auto-dismiss with configurable timing
- **Action Buttons**: Add clickable actions to toasts
- **Persistent Toasts**: Toasts that don't auto-dismiss
- **Multiple Positions**: Top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
- **Smooth Animations**: Enter and exit animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Max Toast Limit**: Configurable maximum number of toasts displayed

## Setup

The notification service is already integrated into the app through the `Providers` component. The `NotificationProvider` wraps the entire application.

## Usage

### Basic Usage

```tsx
import { useToast } from "../../hooks/useToast";

const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!", "Success");
  };

  const handleError = () => {
    toast.error("Something went wrong", "Error");
  };

  const handleWarning = () => {
    toast.warning("Please review your input", "Warning");
  };

  const handleInfo = () => {
    toast.info("Here's some information", "Info");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
};
```

### Advanced Usage

```tsx
const toast = useToast();

// Custom toast with action
toast.toast({
  type: "info",
  title: "New update available",
  message: "A new version is ready to install.",
  action: {
    label: "Update now",
    onClick: () => {
      console.log("Update clicked");
      toast.success("Update started!");
    },
  },
  duration: 10000, // 10 seconds
});

// Persistent toast (no auto-dismiss)
toast.toast({
  type: "warning",
  title: "Important notice",
  message: "This toast will not auto-dismiss.",
  duration: 0, // 0 means no auto-dismiss
});

// Clear all toasts
toast.clearAll();
```

### Toast Configuration

```tsx
interface Toast {
  id: string; // Auto-generated
  title?: string; // Optional title
  message: string; // Required message
  type: "success" | "error" | "warning" | "info";
  duration?: number; // Auto-dismiss time in milliseconds (default: 5000)
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Provider Configuration

```tsx
import { NotificationProvider } from "./components/ui";

// In your app root
<NotificationProvider
  position="top-right" // Default position
  maxToasts={5} // Maximum number of toasts to show
>
  {children}
</NotificationProvider>;
```

## Available Positions

- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

## Integration Examples

### In API Calls

```tsx
const handleSubmit = async (data) => {
  try {
    const response = await fetch("/api/songs", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create song");
    }

    toast.success("Song created successfully!", "Success");
  } catch (error) {
    toast.error(error.message, "Error");
  }
};
```

### In Form Validation

```tsx
const handleFormSubmit = (formData) => {
  if (!formData.title) {
    toast.warning("Please enter a song title", "Validation Error");
    return;
  }

  if (!formData.lyrics) {
    toast.warning("Please enter song lyrics", "Validation Error");
    return;
  }

  // Proceed with submission
  submitForm(formData);
};
```

## Styling

The toast components use Tailwind CSS classes and follow the existing design system. The styling is consistent with other UI components in the application.

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast colors for different toast types

## Best Practices

1. **Keep messages concise**: Toast messages should be brief and to the point
2. **Use appropriate types**:
   - `success` for completed operations
   - `error` for failures and errors
   - `warning` for important notices and validation
   - `info` for general information
3. **Don't overuse**: Avoid showing too many toasts at once
4. **Provide context**: Use titles to give context to the message
5. **Use actions sparingly**: Only add action buttons when the user needs to take immediate action
