
import Vue from "vue";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  alpha_spaces,
  min,
  confirmed,
  digits,
  length,
  alpha
} from "vee-validate/dist/rules";

// Add a rule.
extend("required", {
  ...required,
  message: "This field is required",
});
// Add a rule.
extend("alpha", {
  ...alpha,
  message: "This field takes only alphabets",
});

extend("digits", {
  ...digits,
  message: "Only digits are allowed in this field",
});
extend("length", {
  ...length,
  message: "This field must have exactly 10 digits",
});
extend("email", {
  ...email,
  message: "Please enter a valid email",
});
extend("alpha_spaces", {
  ...alpha_spaces,
  message: "Name must contain only alphabet and spaces",
});
extend("min", {
  ...min,
  message: "This field must have a minimum of 6 characters",
});
extend("confirmed", {
  ...confirmed,
  message: "Passwords do not match",
});
// Register it globally
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);