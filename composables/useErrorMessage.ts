/**
 *
 * @param error The status error of the request. 401, 500, etc.
 * @param entity The entity of the request. "the tile", "the tiles", etc.
 * @param method The METHOD of the request
 * @returns The error message
 */
export const useErrorMessage = (
  error: number | undefined,
  entity: string,
  method: HttpRequestMethod
): string => {
  if (!error) {
    return `Oops, we failed to ${requestToAction(method)} ${entity}. Try again`;
  }
  switch (error) {
    case 401:
      return `Oops, you seem to not be authenticated. Try again or log in`;
    case 500:
      return `Oops, our server is under the weather. Try again later`;
    default:
      return `Oops, we failed to ${requestToAction(
        method
      )} ${entity}. Try again`;
  }
};

function requestToAction(
  request: HttpRequestMethod
): HttpRequestMethodAction {
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
