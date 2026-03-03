function bookRequestForm() {
  return {
    // Field models
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    address: "",
    region: "",
    city: "",
    oblast: "",
    novaPoshtaDepot: "",
    postalCode: "",
    preferredStudyFormat: "Online",
    referral: "",
    comments: "",
    terms: false,
    websiteUrl: "",

    // Submission state
    submitted: false,
    submitting: false,
    success: false,
    serverErrors: {},
    networkError: "",

    // API URL read from data attribute on init
    apiUrl: "",

    init() {
      this.apiUrl = this.$el.dataset.apiUrl;
    },

    // Client-side validation
    get lastNameError() {
      return this.submitted && this.lastName.trim() === "";
    },
    get firstNameError() {
      return this.submitted && this.firstName.trim() === "";
    },
    get emailValid() {
      if (this.email.trim() === "") return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
    },
    get emailFormatError() {
      return this.submitted && this.email.trim() !== "" && !this.emailValid;
    },
    get emailError() {
      return this.emailFormatError;
    },
    get contactError() {
      return (
        this.submitted &&
        this.email.trim() === "" &&
        this.phone.trim() === "" &&
        !this.emailFormatError
      );
    },
    get addressError() {
      return this.submitted && this.address.trim() === "";
    },
    get cityError() {
      return this.submitted && this.city.trim() === "";
    },
    get oblastError() {
      return this.submitted && this.oblast === "";
    },
    get postalCodeError() {
      return this.submitted && this.postalCode.trim() === "";
    },
    get termsError() {
      return this.submitted && !this.terms;
    },
    get hasErrors() {
      return (
        this.lastNameError ||
        this.firstNameError ||
        this.emailFormatError ||
        this.contactError ||
        this.addressError ||
        this.cityError ||
        this.oblastError ||
        this.postalCodeError ||
        this.termsError
      );
    },

    // Server error helper
    fieldError(name) {
      if (!this.serverErrors[name]) return null;
      return this.serverErrors[name].join(", ");
    },

    // Submit handler
    async submitForm() {
      this.submitted = true;
      this.serverErrors = {};
      this.networkError = "";

      if (this.hasErrors) return;

      this.submitting = true;

      const payload = {
        book_request: {
          last_name: this.lastName.trim(),
          first_name: this.firstName.trim(),
          email: this.email.trim(),
          phone: this.phone.trim(),
          address: this.address.trim(),
          region: this.region.trim(),
          city: this.city.trim(),
          oblast: this.oblast,
          nova_poshta_depot: this.novaPoshtaDepot.trim(),
          postal_code: this.postalCode.trim(),
          preferred_study_format: this.preferredStudyFormat,
          referral: this.referral.trim(),
          comments: this.comments.trim(),
          website_url: this.websiteUrl,
        },
      };

      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 201) {
          this.success = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (response.status === 422) {
          const data = await response.json();
          this.serverErrors = data.errors || {};
          this.networkError = "";
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
}
