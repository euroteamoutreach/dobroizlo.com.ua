window.contactForm = function () {
  return {
    fullName: "",
    email: "",
    message: "",
    submitted: false,
    submitting: false,
    success: false,
    networkError: "",

    get fullNameError() {
      return this.submitted && this.fullName.trim() === "";
    },
    get emailError() {
      return this.submitted && !this.emailValid;
    },
    get emailValid() {
      if (this.email.trim() === "") return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
    },
    get emailEmpty() {
      return this.submitted && this.email.trim() === "";
    },
    get emailFormatError() {
      return this.submitted && this.email.trim() !== "" && !this.emailValid;
    },
    get messageError() {
      return this.submitted && this.message.trim() === "";
    },
    get hasErrors() {
      return this.fullNameError || this.emailError || this.messageError;
    },

    async submitForm() {
      this.submitted = true;
      this.networkError = "";
      if (this.hasErrors) return;

      this.submitting = true;

      const formData = new URLSearchParams({
        "form-name": "contact",
        "bot-field": "",
        subject: "[dobroizlo.com.ua] New Contact Request",
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        message: this.message.trim(),
      });

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        if (response.ok) {
          this.success = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        this.networkError =
          "Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз.";
      } catch (e) {
        this.networkError =
          "Не вдалося з\u2019єднатися з сервером. Перевірте інтернет-з\u2019єднання та спробуйте ще раз.";
      } finally {
        this.submitting = false;
      }
    },
  };
};
