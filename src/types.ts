export interface OAuthOptions {
  /** oauth redirect link*/
  url:string;
  /** height in pixels of the window (default 500, must be be greater than or equal to 100) */
  height?:number;
  /** width in pixels of the window (default 500, must be be greater than or equal to 100) */
  width?:number;
  /** x-offset compared to the monitor the window was opened in (default centered, must be a positive integer) */
  left?:number;
  /** y-offset compared to the monitor the window was opened in (default centered, must be a positive integer) */
  top?:number;
}

export interface OAuthProps extends OAuthOptions {
  /** event emitted when the oauth prompt was canceled after being opened */
  onCancel: () => void;
  /** event emitted when the oauth prompt succeeded */
  onSuccess: (code:string, query:URLSearchParams) => void;
  /** event emitted when an error occoured during oauth */
  onError: (query:URLSearchParams) => void;
}