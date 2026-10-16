import { NotificationType } from "../Constants";

export const httpErrorHandler = ({
  err,
  notify,
  logout,
  onCustomError,
}) => {
  // Optional request-specific error handling.
  onCustomError?.(err);

  const errorCases = {
    400: () => {
      notify({
        type: NotificationType.ERROR,
        title: "طلب غير صالح",
        message: "البيانات المرسلة غير صحيحة.",
      });
    },

    401: () => {
      notify({
        type: NotificationType.ERROR,
        title: "انتهت الجلسة",
        message:
          "انتهت صلاحية جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
      });

      // logout is responsible for handling
      // all authentication state changes.
      logout();
    },

    403: () => {
      notify({
        type: NotificationType.ERROR,
        title: "غير مصرح",
        message: "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
      });
    },

    404: () => {
      notify({
        type: NotificationType.ERROR,
        title: "غير موجود",
        message: "المورد المطلوب غير موجود.",
      });
    },

    500: () => {
      notify({
        type: NotificationType.ERROR,
        title: "خطأ في الخادم",
        message:
          "حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقًا.",
      });
    },

    default: () => {
      notify({
        type: NotificationType.ERROR,
        title: "خطأ",
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    },
  };

  const handler =
    errorCases[err?.status] || errorCases.default;

  handler();
};