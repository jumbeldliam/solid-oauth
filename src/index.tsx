/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSignal, onCleanup, ParentComponent, splitProps } from 'solid-js';
import { OAuthOptions, OAuthProps } from './types';


const defaultLength = 450;
const windowY = window.screenTop || window.screenY;
const windowX = window.screenLeft || window.screenX;
const windowW = window.innerWidth || screen.width || window.outerWidth;
const windowH = window.innerHeight || screen.height || window.outerHeight;

const createPopup = (options:OAuthOptions) => {
  const { url } = options;
  const glw = !(options.height || options.width) ? getLength() : 0;
  const width = options.width ?? glw;
  const height = options.height ?? glw;
  const left = windowX ?? (windowW - width) / 2;
  const top = windowY ?? ((windowH - height) / 2.5);
  const round = Math.round;
  const params = `left=${round(left)},top=${round(top)}, width=${round(width)},height=${round(height)}`;
  return window.open(url, '_blank', params);
};

const getLength = () => {
  const lesserLength = Math.min(window.innerHeight, window.innerWidth);
  if (lesserLength <= defaultLength){
    return lesserLength - 20;
  }
  const rl = lesserLength / 2;
  return rl <= defaultLength ? defaultLength : rl;
};



export const OAuth:ParentComponent<OAuthProps> = (props) => {
  const [, windowOptions] = splitProps(props, ['onCancel', 'onError', 'onSuccess', 'children']);

  const [OAuthWindow, setOAuthWindow] = createSignal<Window | null>(null, { equals: (prev, current) => {
    if (current){
      if (prev){
        closeAuth(prev);
      }
      openAuth(current);
    }
    return false;
  } });

  const createAuth = () => setOAuthWindow(createPopup(windowOptions as OAuthOptions));

  const openAuth = (win:Window) => {
    win.onload = () => locationObserver.observe(win.document);
    win.onclose = () => {
      closeAuth(win);
      props.onCancel();
    };
  };

  const closeAuth = (win:Window | null) => {
    win?.close();
    setOAuthWindow(null);
    locationObserver.disconnect();
  };

  const observeLocation = (mutList:MutationRecord[]) => {
    const win = OAuthWindow();
    if (win){
      const currentLocation = win.location.href;
      mutList.forEach(() => {
        if (currentLocation !== props.url){
          const params = new URL(currentLocation).searchParams;
          const code = params.get('code');
          closeAuth(win);
          if (code){
            return props.onSuccess(code, params);
          }
          props.onError(params);
        }
      });
    }
  };

  const locationObserver = new MutationObserver(observeLocation);
    
  onCleanup(() => closeAuth(OAuthWindow()));
  return <div onClick={createAuth}>{props.children}</div>;
};