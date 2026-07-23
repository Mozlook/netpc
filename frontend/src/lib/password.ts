// Mirrors the backend password rule (min 8 chars, uppercase, digit, special). UX only — backend re-validates.
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_HINT =
  "Min. 8 znaków, w tym wielka litera, cyfra i znak specjalny.";
