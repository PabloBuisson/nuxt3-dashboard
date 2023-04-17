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
  errorMessageAuth?: string;
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

let authErrorMessageFirebaseMap: Record<string, string> = {
  ADMIN_ONLY_OPERATION: "auth/admin-restricted-operation",
  ARGUMENT_ERROR: "auth/argument-error",
  APP_NOT_AUTHORIZED: "auth/app-not-authorized",
  APP_NOT_INSTALLED: "auth/app-not-installed",
  CAPTCHA_CHECK_FAILED: "auth/captcha-check-failed",
  CODE_EXPIRED: "auth/code-expired",
  CORDOVA_NOT_READY: "auth/cordova-not-ready",
  CORS_UNSUPPORTED: "auth/cors-unsupported",
  CREDENTIAL_ALREADY_IN_USE: "Oops, credential already in use !",
  CREDENTIAL_MISMATCH: "auth/custom-token-mismatch",
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "auth/requires-recent-login",
  DEPENDENT_SDK_INIT_BEFORE_AUTH: "auth/dependent-sdk-initialized-before-auth",
  DYNAMIC_LINK_NOT_ACTIVATED: "auth/dynamic-link-not-activated",
  EMAIL_CHANGE_NEEDS_VERIFICATION: "auth/email-change-needs-verification",
  EMAIL_EXISTS: "Oops, email already in use !",
  EMULATOR_CONFIG_FAILED: "auth/emulator-config-failed",
  EXPIRED_OOB_CODE: "auth/expired-action-code",
  EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request",
  INTERNAL_ERROR: "auth/internal-error",
  INVALID_API_KEY: "auth/invalid-api-key",
  INVALID_APP_CREDENTIAL: "auth/invalid-app-credential",
  INVALID_APP_ID: "auth/invalid-app-id",
  INVALID_AUTH: "auth/invalid-user-token",
  INVALID_AUTH_EVENT: "auth/invalid-auth-event",
  INVALID_CERT_HASH: "auth/invalid-cert-hash",
  INVALID_CODE: "auth/invalid-verification-code",
  INVALID_CONTINUE_URI: "auth/invalid-continue-uri",
  INVALID_CORDOVA_CONFIGURATION: "auth/invalid-cordova-configuration",
  INVALID_CUSTOM_TOKEN: "auth/invalid-custom-token",
  INVALID_DYNAMIC_LINK_DOMAIN: "auth/invalid-dynamic-link-domain",
  INVALID_EMAIL: "Oops, wrong credential ! Try again",
  INVALID_EMULATOR_SCHEME: "auth/invalid-emulator-scheme",
  INVALID_IDP_RESPONSE: "auth/invalid-credential",
  INVALID_MESSAGE_PAYLOAD: "auth/invalid-message-payload",
  INVALID_MFA_SESSION: "auth/invalid-multi-factor-session",
  INVALID_OAUTH_CLIENT_ID: "auth/invalid-oauth-client-id",
  INVALID_OAUTH_PROVIDER: "auth/invalid-oauth-provider",
  INVALID_OOB_CODE: "auth/invalid-action-code",
  INVALID_ORIGIN: "auth/unauthorized-domain",
  INVALID_PASSWORD: "Oops, wrong credential ! Try again",
  INVALID_PERSISTENCE: "auth/invalid-persistence-type",
  INVALID_PHONE_NUMBER: "Oops, wrong credential ! Try again",
  INVALID_PROVIDER_ID: "auth/invalid-provider-id",
  INVALID_RECIPIENT_EMAIL: "auth/invalid-recipient-email",
  INVALID_SENDER: "auth/invalid-sender",
  INVALID_SESSION_INFO: "auth/invalid-verification-id",
  INVALID_TENANT_ID: "auth/invalid-tenant-id",
  MFA_INFO_NOT_FOUND: "auth/multi-factor-info-not-found",
  MFA_REQUIRED: "auth/multi-factor-auth-required",
  MISSING_ANDROID_PACKAGE_NAME: "auth/missing-android-pkg-name",
  MISSING_APP_CREDENTIAL: "auth/missing-app-credential",
  MISSING_AUTH_DOMAIN: "auth/auth-domain-config-required",
  MISSING_CODE: "auth/missing-verification-code",
  MISSING_CONTINUE_URI: "auth/missing-continue-uri",
  MISSING_IFRAME_START: "auth/missing-iframe-start",
  MISSING_IOS_BUNDLE_ID: "auth/missing-ios-bundle-id",
  MISSING_OR_INVALID_NONCE: "auth/missing-or-invalid-nonce",
  MISSING_MFA_INFO: "auth/missing-multi-factor-info",
  MISSING_MFA_SESSION: "auth/missing-multi-factor-session",
  MISSING_PHONE_NUMBER: "auth/missing-phone-number",
  MISSING_SESSION_INFO: "auth/missing-verification-id",
  MODULE_DESTROYED: "auth/app-deleted",
  NEED_CONFIRMATION: "auth/account-exists-with-different-credential",
  NETWORK_REQUEST_FAILED: "auth/network-request-failed",
  NULL_USER: "auth/null-user",
  NO_AUTH_EVENT: "auth/no-auth-event",
  NO_SUCH_PROVIDER: "auth/no-such-provider",
  OPERATION_NOT_ALLOWED: "auth/operation-not-allowed",
  OPERATION_NOT_SUPPORTED: "auth/operation-not-supported-in-this-environment",
  POPUP_BLOCKED: "auth/popup-blocked",
  POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user",
  PROVIDER_ALREADY_LINKED: "auth/provider-already-linked",
  QUOTA_EXCEEDED: "auth/quota-exceeded",
  REDIRECT_CANCELLED_BY_USER: "auth/redirect-cancelled-by-user",
  REDIRECT_OPERATION_PENDING: "auth/redirect-operation-pending",
  REJECTED_CREDENTIAL: "auth/rejected-credential",
  SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use",
  SECOND_FACTOR_LIMIT_EXCEEDED: "auth/maximum-second-factor-count-exceeded",
  TENANT_ID_MISMATCH: "auth/tenant-id-mismatch",
  TIMEOUT: "auth/timeout",
  TOKEN_EXPIRED: "auth/user-token-expired",
  TOO_MANY_ATTEMPTS_TRY_LATER: "Oops, too many attempts ! Try later",
  UNAUTHORIZED_DOMAIN: "auth/unauthorized-continue-uri",
  UNSUPPORTED_FIRST_FACTOR: "auth/unsupported-first-factor",
  UNSUPPORTED_PERSISTENCE: "auth/unsupported-persistence-type",
  UNSUPPORTED_TENANT_OPERATION: "auth/unsupported-tenant-operation",
  UNVERIFIED_EMAIL: "auth/unverified-email",
  USER_CANCELLED: "auth/user-cancelled",
  USER_DELETED: "auth/user-not-found",
  USER_DISABLED: "auth/user-disabled",
  USER_MISMATCH: "auth/user-mismatch",
  USER_SIGNED_OUT: "auth/user-signed-out",
  WEAK_PASSWORD: "Oops, your password is too weak ! Try another one",
  WEB_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported",
  ALREADY_INITIALIZED: "auth/already-initialized",
};
