// Get form elements
const contactForm = document.querySelector("form");
const nameInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const messageInput = document.querySelector("textarea");

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Form submission handler
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validate form inputs
    if (!name) {
      showResponse("Please enter your name", "error");
      return;
    }

    if (!email) {
      showResponse("Please enter your email", "error");
      return;
    }

    if (!validateEmail(email)) {
      showResponse("Please enter a valid email address", "error");
      return;
    }

    if (!message) {
      showResponse("Please enter a message", "error");
      return;
    }

    // Prepare form data
    const formData = {
      name: name,
      email: email,
      message: message,
      timestamp: new Date().toISOString(),
    };

    // Log form data (for development)
    console.log("Form submitted:", formData);

    // Send form data via fetch
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        showResponse(
          "Message sent successfully! Thank you for reaching out.",
          "success",
        );
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        showResponse(
          "Failed to send message. Please try again later.",
          "error",
        );
      });
  });
}

// Response message display function
function showResponse(message, type) {
  // Create or get response element
  let responseElement = document.getElementById("form-response");

  if (!responseElement) {
    responseElement = document.createElement("div");
    responseElement.id = "form-response";
    contactForm.insertAdjacentElement("beforeend", responseElement);
  }

  // Set styles based on type
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const borderColor =
    type === "success" ? "border-green-400" : "border-red-400";

  responseElement.className = `mt-4 p-4 rounded-lg border-l-4 ${bgColor} ${textColor} ${borderColor}`;
  responseElement.textContent = message;

  // Auto-clear success message after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      responseElement.remove();
    }, 5000);
  }
}
