import {query, validationResult, body, matchedData} from "express-validator";

export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {min: 4, max: 32},
      errorMessage: "name cannot be less than 3",
    },
    notEmpty: {errorMessage: "name can not be empty"},
    isString: {errorMessage: "name is a string"},
  },

  display: {
    notEmpty: {errorMessage: "display can not be empty"},
    isString: {errorMessage: "display is a string"},
  },
};

export const createUserValidationSchema2 = {
  username: {
    isLength: {
      options: {min: 4, max: 32},
      errorMessage: "name cannot be less than 3",
    },
    notEmpty: {errorMessage: "name can not be empty"},
    isString: {errorMessage: "name is a string"},
  },

  displayName: {
    notEmpty: {errorMessage: "display can not be empty"},
    isString: {errorMessage: "display is a string"},
  },
  password: {
    notEmpty: {errorMessage: "password can not be empty"},
  },
};

// Do for params
