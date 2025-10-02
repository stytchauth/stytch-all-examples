// Helper function to format dates safely
export const formatDate = (dateInput: any): string => {
  try {
    if (!dateInput) return 'Unknown';

    // Debug: log the input to see what we're getting
    console.log('formatDate input:', dateInput, 'type:', typeof dateInput);

    let date: Date;

    // Handle different date formats
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (dateInput.seconds) {
      // Firebase Timestamp object
      date = new Date(dateInput.seconds * 1000);
    } else if (dateInput._seconds) {
      // Alternative Firebase Timestamp format
      date = new Date(dateInput._seconds * 1000);
    } else {
      date = new Date(dateInput);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput);
      return 'Invalid Date';
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', dateInput, error);
    return 'Invalid Date';
  }
};

// Helper function to format dates with time
export const formatDateTime = (dateInput: any): string => {
  try {
    if (!dateInput) return 'Unknown';

    let date: Date;

    // Handle different date formats
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (dateInput.seconds) {
      // Firebase Timestamp object
      date = new Date(dateInput.seconds * 1000);
    } else if (dateInput._seconds) {
      // Alternative Firebase Timestamp format
      date = new Date(dateInput._seconds * 1000);
    } else {
      date = new Date(dateInput);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput);
      return 'Invalid Date';
    }

    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', dateInput, error);
    return 'Invalid Date';
  }
};
