export function createAdminFormState(values = {}, errors = {}, touched = {}) {
  return {
    errors,
    isDirty: false,
    isSubmitting: false,
    touched,
    values,
  };
}

export function mergeAdminFormValues(formState, values = {}) {
  return {
    ...formState,
    isDirty: true,
    values: {
      ...formState.values,
      ...values,
    },
  };
}
