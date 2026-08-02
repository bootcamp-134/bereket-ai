import { Resend } from "resend";

export const RESEND_CLIENT = Symbol("RESEND_CLIENT");

export const resendClientProvider = {
  provide: RESEND_CLIENT,
  useFactory: () =>
    process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null,
};
