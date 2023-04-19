/**
 * Return an explicit error message
 * @param error The status error of the request. 401, 500, etc.
 * @param entity The entity of the request. "the tile", "the tiles", etc.
 * @param method The METHOD of the request
 * @param isAboutAuth IF the request is authentication related
 * @param errorMessageAuth The Firebase error message
 * @returns The error message
 */
export const useErrorMessage = (params: {
  error?: number;
  entity: string;
  method: HttpRequestMethod;
  isAboutAuth?: boolean;
  errorMessageAuth?: HttpResponseErrorAuthFirebase;
}): string => {
  if (!params.error && !params.isAboutAuth && !params.errorMessageAuth) {
    return `Oops, we failed to ${requestToAction(params.method)} ${
      params.entity
    }. Try again`;
  }

  if (params.isAboutAuth && params.errorMessageAuth) {
    return (
      authErrorMessageFirebaseMap[params.errorMessageAuth] ??
      params.errorMessageAuth
    );
  } else {
    switch (params.error) {
      case 401:
        return `Oops, you seem to not be authenticated. Try again or log in`;
      case 500:
        return `Oops, our server is under the weather. Try again later`;
      default:
        return `Oops, we failed to ${requestToAction(params.method)} ${
          params.entity
        }. Try again`;
    }
  }
};

function requestToAction(request: HttpRequestMethod): HttpRequestMethodAction {
  switch (request) {
    case HttpRequestMethod.GET:
      return HttpRequestMethodAction.GET;
    case HttpRequestMethod.POST:
      return HttpRequestMethodAction.POST;
    case HttpRequestMethod.PUT:
      return HttpRequestMethodAction.PUT;
    case HttpRequestMethod.DELETE:
      return HttpRequestMethodAction.DELETE;
    default:
      return HttpRequestMethodAction.GET;
  }
}

export enum HttpRequestMethodAction {
  POST = "create",
  GET = "retrieve",
  PUT = "modify",
  DELETE = "delete",
}

export enum HttpRequestMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum HttpResponseErrorAuthFirebase {
  ADMIN_ONLY_OPERATION = "ADMIN_ONLY_OPERATION",
  ARGUMENT_ERROR = "ARGUMENT_ERROR",
  APP_NOT_AUTHORIZED = "APP_NOT_AUTHORIZED",
  APP_NOT_INSTALLED = "APP_NOT_INSTALLED",
  CAPTCHA_CHECK_FAILED = "CAPTCHA_CHECK_FAILED",
  CODE_EXPIRED = "CODE_EXPIRED",
  CORDOVA_NOT_READY = "CORDOVA_NOT_READY",
  CORS_UNSUPPORTED = "CORS_UNSUPPORTED",
  CREDENTIAL_ALREADY_IN_USE = "CREDENTIAL_ALREADY_IN_USE",
  CREDENTIAL_MISMATCH = "CREDENTIAL_MISMATCH",
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN = "CREDENTIAL_TOO_OLD_LOGIN_AGAIN",
  DEPENDENT_SDK_INIT_BEFORE_AUTH = "DEPENDENT_SDK_INIT_BEFORE_AUTH",
  DYNAMIC_LINK_NOT_ACTIVATED = "DYNAMIC_LINK_NOT_ACTIVATED",
  EMAIL_CHANGE_NEEDS_VERIFICATION = "EMAIL_CHANGE_NEEDS_VERIFICATION",
  EMAIL_EXISTS = "EMAIL_EXISTS",
  EMULATOR_CONFIG_FAILED = "EMULATOR_CONFIG_FAILED",
  EXPIRED_OOB_CODE = "EXPIRED_OOB_CODE",
  EXPIRED_POPUP_REQUEST = "EXPIRED_POPUP_REQUEST",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  INVALID_API_KEY = "INVALID_API_KEY",
  INVALID_APP_CREDENTIAL = "INVALID_APP_CREDENTIAL",
  INVALID_APP_ID = "INVALID_APP_ID",
  INVALID_AUTH = "INVALID_AUTH",
  INVALID_AUTH_EVENT = "INVALID_AUTH_EVENT",
  INVALID_CERT_HASH = "INVALID_CERT_HASH",
  INVALID_CODE = "INVALID_CODE",
  INVALID_CONTINUE_URI = "INVALID_CONTINUE_URI",
  INVALID_CORDOVA_CONFIGURATION = "INVALID_CORDOVA_CONFIGURATION",
  INVALID_CUSTOM_TOKEN = "INVALID_CUSTOM_TOKEN",
  INVALID_DYNAMIC_LINK_DOMAIN = "INVALID_DYNAMIC_LINK_DOMAIN",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_EMULATOR_SCHEME = "INVALID_EMULATOR_SCHEME",
  INVALID_IDP_RESPONSE = "INVALID_IDP_RESPONSE",
  INVALID_MESSAGE_PAYLOAD = "INVALID_MESSAGE_PAYLOAD",
  INVALID_MFA_SESSION = "INVALID_MFA_SESSION",
  INVALID_OAUTH_CLIENT_ID = "INVALID_OAUTH_CLIENT_ID",
  INVALID_OAUTH_PROVIDER = "INVALID_OAUTH_PROVIDER",
  INVALID_OOB_CODE = "INVALID_OOB_CODE",
  INVALID_ORIGIN = "INVALID_ORIGIN",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  INVALID_PERSISTENCE = "INVALID_PERSISTENCE",
  INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
  INVALID_PROVIDER_ID = "INVALID_PROVIDER_ID",
  INVALID_RECIPIENT_EMAIL = "INVALID_RECIPIENT_EMAIL",
  INVALID_SENDER = "INVALID_SENDER",
  INVALID_SESSION_INFO = "INVALID_SESSION_INFO",
  INVALID_TENANT_ID = "INVALID_TENANT_ID",
  MFA_INFO_NOT_FOUND = "MFA_INFO_NOT_FOUND",
  MFA_REQUIRED = "MFA_REQUIRED",
  MISSING_ANDROID_PACKAGE_NAME = "MISSING_ANDROID_PACKAGE_NAME",
  MISSING_APP_CREDENTIAL = "MISSING_APP_CREDENTIAL",
  MISSING_AUTH_DOMAIN = "MISSING_AUTH_DOMAIN",
  MISSING_CODE = "MISSING_CODE",
  MISSING_CONTINUE_URI = "MISSING_CONTINUE_URI",
  MISSING_IFRAME_START = "MISSING_IFRAME_START",
  MISSING_IOS_BUNDLE_ID = "MISSING_IOS_BUNDLE_ID",
  MISSING_OR_INVALID_NONCE = "MISSING_OR_INVALID_NONCE",
  MISSING_MFA_INFO = "MISSING_MFA_INFO",
  MISSING_MFA_SESSION = "MISSING_MFA_SESSION",
  MISSING_PHONE_NUMBER = "MISSING_PHONE_NUMBER",
  MISSING_SESSION_INFO = "MISSING_SESSION_INFO",
  MODULE_DESTROYED = "MODULE_DESTROYED",
  NEED_CONFIRMATION = "NEED_CONFIRMATION",
  NETWORK_REQUEST_FAILED = "NETWORK_REQUEST_FAILED",
  NULL_USER = "NULL_USER",
  NO_AUTH_EVENT = "NO_AUTH_EVENT",
  NO_SUCH_PROVIDER = "NO_SUCH_PROVIDER",
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
  OPERATION_NOT_SUPPORTED = "OPERATION_NOT_SUPPORTED",
  POPUP_BLOCKED = "POPUP_BLOCKED",
  POPUP_CLOSED_BY_USER = "POPUP_CLOSED_BY_USER",
  PROVIDER_ALREADY_LINKED = "PROVIDER_ALREADY_LINKED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  REDIRECT_CANCELLED_BY_USER = "REDIRECT_CANCELLED_BY_USER",
  REDIRECT_OPERATION_PENDING = "REDIRECT_OPERATION_PENDING",
  REJECTED_CREDENTIAL = "REJECTED_CREDENTIAL",
  SECOND_FACTOR_ALREADY_ENROLLED = "SECOND_FACTOR_ALREADY_ENROLLED",
  SECOND_FACTOR_LIMIT_EXCEEDED = "SECOND_FACTOR_LIMIT_EXCEEDED",
  TENANT_ID_MISMATCH = "TENANT_ID_MISMATCH",
  TIMEOUT = "TIMEOUT",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOO_MANY_ATTEMPTS_TRY_LATER = "TOO_MANY_ATTEMPTS_TRY_LATER",
  UNAUTHORIZED_DOMAIN = "UNAUTHORIZED_DOMAIN",
  UNSUPPORTED_FIRST_FACTOR = "UNSUPPORTED_FIRST_FACTOR",
  UNSUPPORTED_PERSISTENCE = "UNSUPPORTED_PERSISTENCE",
  UNSUPPORTED_TENANT_OPERATION = "UNSUPPORTED_TENANT_OPERATION",
  UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
  USER_CANCELLED = "USER_CANCELLED",
  USER_DELETED = "USER_DELETED",
  USER_DISABLED = "USER_DISABLED",
  USER_MISMATCH = "USER_MISMATCH",
  USER_SIGNED_OUT = "USER_SIGNED_OUT",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  WEB_STORAGE_UNSUPPORTED = "WEB_STORAGE_UNSUPPORTED",
  ALREADY_INITIALIZED = "ALREADY_INITIALIZED",
}

const authErrorMessageFirebaseMap: Record<HttpResponseErrorAuthFirebase, string> =
  {
    [HttpResponseErrorAuthFirebase.ADMIN_ONLY_OPERATION]:
      "auth/admin-restricted-operation",
    [HttpResponseErrorAuthFirebase.ARGUMENT_ERROR]: "auth/argument-error",
    [HttpResponseErrorAuthFirebase.APP_NOT_AUTHORIZED]:
      "auth/app-not-authorized",
    [HttpResponseErrorAuthFirebase.APP_NOT_INSTALLED]: "auth/app-not-installed",
    [HttpResponseErrorAuthFirebase.CAPTCHA_CHECK_FAILED]:
      "auth/captcha-check-failed",
    [HttpResponseErrorAuthFirebase.CODE_EXPIRED]: "auth/code-expired",
    [HttpResponseErrorAuthFirebase.CORDOVA_NOT_READY]: "auth/cordova-not-ready",
    [HttpResponseErrorAuthFirebase.CORS_UNSUPPORTED]: "auth/cors-unsupported",
    [HttpResponseErrorAuthFirebase.CREDENTIAL_ALREADY_IN_USE]:
      "Oops, credential already in use !",
    [HttpResponseErrorAuthFirebase.CREDENTIAL_MISMATCH]:
      "auth/custom-token-mismatch",
    [HttpResponseErrorAuthFirebase.CREDENTIAL_TOO_OLD_LOGIN_AGAIN]:
      "auth/requires-recent-login",
    [HttpResponseErrorAuthFirebase.DEPENDENT_SDK_INIT_BEFORE_AUTH]:
      "auth/dependent-sdk-initialized-before-auth",
    [HttpResponseErrorAuthFirebase.DYNAMIC_LINK_NOT_ACTIVATED]:
      "auth/dynamic-link-not-activated",
    [HttpResponseErrorAuthFirebase.EMAIL_CHANGE_NEEDS_VERIFICATION]:
      "auth/email-change-needs-verification",
    [HttpResponseErrorAuthFirebase.EMAIL_EXISTS]:
      "Oops, email already in use !",
    [HttpResponseErrorAuthFirebase.EMULATOR_CONFIG_FAILED]:
      "auth/emulator-config-failed",
    [HttpResponseErrorAuthFirebase.EXPIRED_OOB_CODE]:
      "auth/expired-action-code",
    [HttpResponseErrorAuthFirebase.EXPIRED_POPUP_REQUEST]:
      "auth/cancelled-popup-request",
    [HttpResponseErrorAuthFirebase.INTERNAL_ERROR]: "auth/internal-error",
    [HttpResponseErrorAuthFirebase.INVALID_API_KEY]: "auth/invalid-api-key",
    [HttpResponseErrorAuthFirebase.INVALID_APP_CREDENTIAL]:
      "auth/invalid-app-credential",
    [HttpResponseErrorAuthFirebase.INVALID_APP_ID]: "auth/invalid-app-id",
    [HttpResponseErrorAuthFirebase.INVALID_AUTH]: "auth/invalid-user-token",
    [HttpResponseErrorAuthFirebase.INVALID_AUTH_EVENT]:
      "auth/invalid-auth-event",
    [HttpResponseErrorAuthFirebase.INVALID_CERT_HASH]: "auth/invalid-cert-hash",
    [HttpResponseErrorAuthFirebase.INVALID_CODE]:
      "auth/invalid-verification-code",
    [HttpResponseErrorAuthFirebase.INVALID_CONTINUE_URI]:
      "auth/invalid-continue-uri",
    [HttpResponseErrorAuthFirebase.INVALID_CORDOVA_CONFIGURATION]:
      "auth/invalid-cordova-configuration",
    [HttpResponseErrorAuthFirebase.INVALID_CUSTOM_TOKEN]:
      "auth/invalid-custom-token",
    [HttpResponseErrorAuthFirebase.INVALID_DYNAMIC_LINK_DOMAIN]:
      "auth/invalid-dynamic-link-domain",
    [HttpResponseErrorAuthFirebase.INVALID_EMAIL]:
      "Oops, wrong credential ! Try again",
    [HttpResponseErrorAuthFirebase.INVALID_EMULATOR_SCHEME]:
      "auth/invalid-emulator-scheme",
    [HttpResponseErrorAuthFirebase.INVALID_IDP_RESPONSE]:
      "auth/invalid-credential",
    [HttpResponseErrorAuthFirebase.INVALID_MESSAGE_PAYLOAD]:
      "auth/invalid-message-payload",
    [HttpResponseErrorAuthFirebase.INVALID_MFA_SESSION]:
      "auth/invalid-multi-factor-session",
    [HttpResponseErrorAuthFirebase.INVALID_OAUTH_CLIENT_ID]:
      "auth/invalid-oauth-client-id",
    [HttpResponseErrorAuthFirebase.INVALID_OAUTH_PROVIDER]:
      "auth/invalid-oauth-provider",
    [HttpResponseErrorAuthFirebase.INVALID_OOB_CODE]:
      "auth/invalid-action-code",
    [HttpResponseErrorAuthFirebase.INVALID_ORIGIN]: "auth/unauthorized-domain",
    [HttpResponseErrorAuthFirebase.INVALID_PASSWORD]:
      "Oops, wrong credential ! Try again",
    [HttpResponseErrorAuthFirebase.INVALID_PERSISTENCE]:
      "auth/invalid-persistence-type",
    [HttpResponseErrorAuthFirebase.INVALID_PHONE_NUMBER]:
      "Oops, wrong credential ! Try again",
    [HttpResponseErrorAuthFirebase.INVALID_PROVIDER_ID]:
      "auth/invalid-provider-id",
    [HttpResponseErrorAuthFirebase.INVALID_RECIPIENT_EMAIL]:
      "auth/invalid-recipient-email",
    [HttpResponseErrorAuthFirebase.INVALID_SENDER]: "auth/invalid-sender",
    [HttpResponseErrorAuthFirebase.INVALID_SESSION_INFO]:
      "auth/invalid-verification-id",
    [HttpResponseErrorAuthFirebase.INVALID_TENANT_ID]: "auth/invalid-tenant-id",
    [HttpResponseErrorAuthFirebase.MFA_INFO_NOT_FOUND]:
      "auth/multi-factor-info-not-found",
    [HttpResponseErrorAuthFirebase.MFA_REQUIRED]:
      "auth/multi-factor-auth-required",
    [HttpResponseErrorAuthFirebase.MISSING_ANDROID_PACKAGE_NAME]:
      "auth/missing-android-pkg-name",
    [HttpResponseErrorAuthFirebase.MISSING_APP_CREDENTIAL]:
      "auth/missing-app-credential",
    [HttpResponseErrorAuthFirebase.MISSING_AUTH_DOMAIN]:
      "auth/auth-domain-config-required",
    [HttpResponseErrorAuthFirebase.MISSING_CODE]:
      "auth/missing-verification-code",
    [HttpResponseErrorAuthFirebase.MISSING_CONTINUE_URI]:
      "auth/missing-continue-uri",
    [HttpResponseErrorAuthFirebase.MISSING_IFRAME_START]:
      "auth/missing-iframe-start",
    [HttpResponseErrorAuthFirebase.MISSING_IOS_BUNDLE_ID]:
      "auth/missing-ios-bundle-id",
    [HttpResponseErrorAuthFirebase.MISSING_OR_INVALID_NONCE]:
      "auth/missing-or-invalid-nonce",
    [HttpResponseErrorAuthFirebase.MISSING_MFA_INFO]:
      "auth/missing-multi-factor-info",
    [HttpResponseErrorAuthFirebase.MISSING_MFA_SESSION]:
      "auth/missing-multi-factor-session",
    [HttpResponseErrorAuthFirebase.MISSING_PHONE_NUMBER]:
      "auth/missing-phone-number",
    [HttpResponseErrorAuthFirebase.MISSING_SESSION_INFO]:
      "auth/missing-verification-id",
    [HttpResponseErrorAuthFirebase.MODULE_DESTROYED]: "auth/app-deleted",
    [HttpResponseErrorAuthFirebase.NEED_CONFIRMATION]:
      "auth/account-exists-with-different-credential",
    [HttpResponseErrorAuthFirebase.NETWORK_REQUEST_FAILED]:
      "auth/network-request-failed",
    [HttpResponseErrorAuthFirebase.NULL_USER]: "auth/null-user",
    [HttpResponseErrorAuthFirebase.NO_AUTH_EVENT]: "auth/no-auth-event",
    [HttpResponseErrorAuthFirebase.NO_SUCH_PROVIDER]: "auth/no-such-provider",
    [HttpResponseErrorAuthFirebase.OPERATION_NOT_ALLOWED]:
      "auth/operation-not-allowed",
    [HttpResponseErrorAuthFirebase.OPERATION_NOT_SUPPORTED]:
      "auth/operation-not-supported-in-this-environment",
    [HttpResponseErrorAuthFirebase.POPUP_BLOCKED]: "auth/popup-blocked",
    [HttpResponseErrorAuthFirebase.POPUP_CLOSED_BY_USER]:
      "auth/popup-closed-by-user",
    [HttpResponseErrorAuthFirebase.PROVIDER_ALREADY_LINKED]:
      "auth/provider-already-linked",
    [HttpResponseErrorAuthFirebase.QUOTA_EXCEEDED]: "auth/quota-exceeded",
    [HttpResponseErrorAuthFirebase.REDIRECT_CANCELLED_BY_USER]:
      "auth/redirect-cancelled-by-user",
    [HttpResponseErrorAuthFirebase.REDIRECT_OPERATION_PENDING]:
      "auth/redirect-operation-pending",
    [HttpResponseErrorAuthFirebase.REJECTED_CREDENTIAL]:
      "auth/rejected-credential",
    [HttpResponseErrorAuthFirebase.SECOND_FACTOR_ALREADY_ENROLLED]:
      "auth/second-factor-already-in-use",
    [HttpResponseErrorAuthFirebase.SECOND_FACTOR_LIMIT_EXCEEDED]:
      "auth/maximum-second-factor-count-exceeded",
    [HttpResponseErrorAuthFirebase.TENANT_ID_MISMATCH]:
      "auth/tenant-id-mismatch",
    [HttpResponseErrorAuthFirebase.TIMEOUT]: "auth/timeout",
    [HttpResponseErrorAuthFirebase.TOKEN_EXPIRED]: "auth/user-token-expired",
    [HttpResponseErrorAuthFirebase.TOO_MANY_ATTEMPTS_TRY_LATER]:
      "Oops, too many attempts ! Try later",
    [HttpResponseErrorAuthFirebase.UNAUTHORIZED_DOMAIN]:
      "auth/unauthorized-continue-uri",
    [HttpResponseErrorAuthFirebase.UNSUPPORTED_FIRST_FACTOR]:
      "auth/unsupported-first-factor",
    [HttpResponseErrorAuthFirebase.UNSUPPORTED_PERSISTENCE]:
      "auth/unsupported-persistence-type",
    [HttpResponseErrorAuthFirebase.UNSUPPORTED_TENANT_OPERATION]:
      "auth/unsupported-tenant-operation",
    [HttpResponseErrorAuthFirebase.UNVERIFIED_EMAIL]: "auth/unverified-email",
    [HttpResponseErrorAuthFirebase.USER_CANCELLED]: "auth/user-cancelled",
    [HttpResponseErrorAuthFirebase.USER_DELETED]: "auth/user-not-found",
    [HttpResponseErrorAuthFirebase.USER_DISABLED]: "auth/user-disabled",
    [HttpResponseErrorAuthFirebase.USER_MISMATCH]: "auth/user-mismatch",
    [HttpResponseErrorAuthFirebase.USER_SIGNED_OUT]: "auth/user-signed-out",
    [HttpResponseErrorAuthFirebase.WEAK_PASSWORD]:
      "Oops, your password is too weak ! Try another one",
    [HttpResponseErrorAuthFirebase.WEB_STORAGE_UNSUPPORTED]:
      "auth/web-storage-unsupported",
    [HttpResponseErrorAuthFirebase.ALREADY_INITIALIZED]:
      "auth/already-initialized",
  };
