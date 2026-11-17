// Form models whose server errors render under the field, keyed by the
// API's field name. Errors for any other key go in the box above submit.
const SERVER_FIELDS = {
  last_name: "lastName",
  first_name: "firstName",
  email: "email",
  address: "address",
  city: "city",
  oblast: "oblast",
  nova_poshta_depot: "novaPoshtaDepot",
  postal_code: "postalCode",
  phone: "phone",
};

// Fields without their own error slot, with the label that gives their
// server error context in the box above submit.
const GENERAL_FIELDS = {
  region: { model: "region", label: "Район" },
  preferred_study_format: {
    model: "preferredStudyFormat",
    label: "Формат навчання",
  },
  referral: {
    model: "referral",
    label: "Звідки Ви дізналися про «Добро і зло»",
  },
  comments: { model: "comments", label: "Коментарі" },
};

const GENERIC_ERROR =
  "Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз.";

// The API sends an array of messages per field; tolerate a bare string.
const messageText = (messages) => [].concat(messages).join(", ");

window.bookRequestForm = function () {
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
    preferredStudyFormat: "online",
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

      // A server error goes stale once the user edits that field.
      const models = {
        ...SERVER_FIELDS,
        ...Object.fromEntries(
          Object.entries(GENERAL_FIELDS).map(([key, f]) => [key, f.model]),
        ),
      };
      for (const [key, model] of Object.entries(models)) {
        this.$watch(model, () => {
          if (!this.serverErrors[key]) return;
          const { [key]: _stale, ...rest } = this.serverErrors;
          this.serverErrors = rest;
        });
      }
    },

    // Client-side validation
    get lastNameError() {
      return this.submitted && this.lastName.trim() === "";
    },
    get firstNameError() {
      return this.submitted && this.firstName.trim() === "";
    },
    get emailValid() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
    },
    get emailFormatError() {
      return this.submitted && this.email.trim() !== "" && !this.emailValid;
    },
    get emailRequiredError() {
      return this.submitted && this.email.trim() === "";
    },
    get emailError() {
      return this.emailRequiredError || this.emailFormatError;
    },
    get phoneError() {
      return this.submitted && this.phone.trim() === "";
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
    get novaPoshtaDepotError() {
      return this.submitted && this.novaPoshtaDepot.trim() === "";
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
        this.emailError ||
        this.phoneError ||
        this.addressError ||
        this.cityError ||
        this.oblastError ||
        this.novaPoshtaDepotError ||
        this.postalCodeError ||
        this.termsError
      );
    },

    // Server error helpers
    get hasServerErrors() {
      return Object.keys(this.serverErrors).length > 0;
    },
    get hasFieldServerErrors() {
      return Object.keys(this.serverErrors).some((key) => key in SERVER_FIELDS);
    },
    get generalServerError() {
      return Object.entries(this.serverErrors)
        .filter(([key]) => !(key in SERVER_FIELDS))
        .map(([key, messages]) => {
          const label = GENERAL_FIELDS[key]?.label;
          return (label ? `${label}: ` : "") + messageText(messages);
        })
        .join(" ");
    },
    get formError() {
      return this.networkError || this.generalServerError;
    },
    fieldError(name) {
      if (!this.serverErrors[name]) return null;
      return messageText(this.serverErrors[name]);
    },
    invalid(clientError, key) {
      return clientError || !!this.fieldError(key);
    },

    // Ids of the error messages currently shown for a field, for
    // aria-describedby. Null removes the attribute.
    describedBy(ids) {
      const shown = Object.keys(ids).filter((id) => ids[id]);
      return shown.length ? shown.join(" ") : null;
    },

    // Move focus to the first invalid field, or to the form error box when
    // no field is marked, once Alpine has rendered the error state, so
    // screen-reader users hear why submit was blocked.
    focusFirstInvalid() {
      this.$nextTick(() => {
        const target =
          this.$el.querySelector('[aria-invalid="true"]') ||
          (this.formError ? this.$refs.formError : null);
        target?.focus();
      });
    },

    // Submit handler
    async submitForm() {
      this.submitted = true;
      this.serverErrors = {};
      this.networkError = "";

      if (this.hasErrors) {
        this.focusFirstInvalid();
        return;
      }

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
          // A rejection with no details would otherwise show nothing at all.
          this.networkError = this.hasServerErrors ? "" : GENERIC_ERROR;
          this.focusFirstInvalid();
          return;
        }

        this.networkError = GENERIC_ERROR;
        this.focusFirstInvalid();
      } catch (e) {
        this.networkError =
          "Не вдалося з\u2019єднатися з сервером. Перевірте інтернет-з\u2019єднання та спробуйте ще раз.";
        this.focusFirstInvalid();
      } finally {
        this.submitting = false;
      }
    },
  };
};
