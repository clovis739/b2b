export type HttpStatus = {
  code: number;
  name: string;
  title: string;
  description: string;
};
// IANA registry checked 22 October 2026. Unused codes (including 418) are excluded.
export const httpStatuses: HttpStatus[] = [
  {
    code: 400,
    name: "Bad Request",
    title: "We could not understand that request.",
    description:
      "Check the address or the information you entered, then submit it again.",
  },
  {
    code: 401,
    name: "Unauthorized",
    title: "Sign in to continue.",
    description:
      "Your session may have expired, or this page requires an account.",
  },
  {
    code: 402,
    name: "Payment Required",
    title: "This request requires payment.",
    description:
      "Review the payment requirements for the service you are trying to use.",
  },
  {
    code: 403,
    name: "Forbidden",
    title: "You do not have access to this page.",
    description:
      "Sign in with an account that has permission, or contact support for help.",
  },
  {
    code: 404,
    name: "Not Found",
    title: "This page could not be found.",
    description:
      "The address may have changed, or the page may no longer be available.",
  },
  {
    code: 405,
    name: "Method Not Allowed",
    title: "That action is not available here.",
    description:
      "Return to the page and use its available controls to continue.",
  },
  {
    code: 406,
    name: "Not Acceptable",
    title: "We cannot provide the requested format.",
    description: "Try opening the page normally in your browser.",
  },
  {
    code: 407,
    name: "Proxy Authentication Required",
    title: "Your proxy needs you to sign in.",
    description: "Check your network or proxy settings before trying again.",
  },
  {
    code: 408,
    name: "Request Timeout",
    title: "The request took too long.",
    description: "Check your connection and try again when you are ready.",
  },
  {
    code: 409,
    name: "Conflict",
    title: "Something changed before your update finished.",
    description:
      "Review the latest version before submitting your changes again.",
  },
  {
    code: 410,
    name: "Gone",
    title: "This content is no longer available.",
    description:
      "Explore the marketplace to find other products, suppliers and resources.",
  },
  {
    code: 411,
    name: "Length Required",
    title: "The request is missing its content size.",
    description:
      "Return to the form and submit it using the available controls.",
  },
  {
    code: 412,
    name: "Precondition Failed",
    title: "The request no longer matches the current version.",
    description: "Review the latest information before making another update.",
  },
  {
    code: 413,
    name: "Content Too Large",
    title: "That upload is too large.",
    description:
      "Choose a smaller file or reduce its size before uploading again.",
  },
  {
    code: 414,
    name: "URI Too Long",
    title: "That address is too long.",
    description:
      "Shorten your search or remove unnecessary filters and try again.",
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    title: "This file format is not supported.",
    description: "Check the accepted file types shown on the upload form.",
  },
  {
    code: 416,
    name: "Range Not Satisfiable",
    title: "That part of the file is unavailable.",
    description: "Open the complete file or start a new download.",
  },
  {
    code: 417,
    name: "Expectation Failed",
    title: "The server cannot meet that request.",
    description: "Return to the page and try using its standard controls.",
  },
  {
    code: 421,
    name: "Misdirected Request",
    title: "The request reached the wrong destination.",
    description: "Open the site again using its usual address.",
  },
  {
    code: 422,
    name: "Unprocessable Content",
    title: "Some information needs another look.",
    description:
      "Review the highlighted fields in the form and correct them before submitting.",
  },
  {
    code: 423,
    name: "Locked",
    title: "This resource is currently locked.",
    description:
      "Another operation may be using it. Wait before trying to make changes.",
  },
  {
    code: 424,
    name: "Failed Dependency",
    title: "A required step did not finish.",
    description: "Complete the earlier step successfully before continuing.",
  },
  {
    code: 425,
    name: "Too Early",
    title: "The request arrived before it could be safely processed.",
    description: "Wait a moment before trying the action again.",
  },
  {
    code: 426,
    name: "Upgrade Required",
    title: "A connection upgrade is required.",
    description:
      "Use an up-to-date browser and a secure connection to continue.",
  },
  {
    code: 428,
    name: "Precondition Required",
    title: "The latest version needs to be confirmed.",
    description:
      "Review the current information before submitting your update.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    title: "Please slow down for a moment.",
    description:
      "Too many requests arrived in a short time. Wait before trying again.",
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    title: "The request contains too much header information.",
    description:
      "Try a fresh browser session. If the issue continues, contact support.",
  },
  {
    code: 451,
    name: "Unavailable For Legal Reasons",
    title: "This content is restricted.",
    description:
      "Access is unavailable for legal reasons. Contact support if you need more information.",
  },
  {
    code: 500,
    name: "Internal Server Error",
    title: "Something went wrong on our side.",
    description:
      "We could not complete this request. You can try loading the page again.",
  },
  {
    code: 501,
    name: "Not Implemented",
    title: "This capability is not supported.",
    description:
      "Use another available feature or contact support about what you need.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    title: "A connected service returned an unexpected response.",
    description: "Please wait a moment before loading the page again.",
  },
  {
    code: 503,
    name: "Service Unavailable",
    title: "This service is temporarily unavailable.",
    description:
      "The service may be busy or undergoing maintenance. Please try again later.",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    title: "A connected service took too long.",
    description: "Please wait a moment before trying to load this page again.",
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    title: "This connection version is not supported.",
    description: "Try using an up-to-date browser to open the site.",
  },
  {
    code: 506,
    name: "Variant Also Negotiates",
    title: "The server could not choose a response.",
    description:
      "A server configuration problem prevented this page from loading. Contact support if it continues.",
  },
  {
    code: 507,
    name: "Insufficient Storage",
    title: "There is not enough server storage for this request.",
    description:
      "Try again later or contact support if you need to complete an upload.",
  },
  {
    code: 508,
    name: "Loop Detected",
    title: "The server could not finish processing the request.",
    description:
      "A repeating operation prevented completion. Contact support if it continues.",
  },
  {
    code: 510,
    name: "Not Extended (Obsoleted)",
    title: "This server requires an unsupported extension.",
    description:
      "This historical status is obsolete. Contact support if a service still returns it.",
  },
  {
    code: 511,
    name: "Network Authentication Required",
    title: "Your network needs you to sign in.",
    description:
      "Complete your network or Wi-Fi sign-in, then return to this page.",
  },
];
export const getHttpStatus = (code: number) =>
  httpStatuses.find((status) => status.code === code)!;
