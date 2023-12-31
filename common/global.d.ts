declare module 'virtual:reload-on-update-in-background-script' {
  export const reloadOnUpdate: (watchPath: string) => void;
  export default reloadOnUpdate;
}

declare module 'virtual:reload-on-update-in-view' {
  const refreshOnUpdate: (watchPath: string) => void;
  export default refreshOnUpdate;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}

declare module '*?inline' {
  const src: string
  export default src
}

declare module '*?worker' {
  const content: string
  export default src
}

declare module "react/jsx-runtime" {
  export default any;
}

declare let __PROJECT_NAME__: string;

// 扩展chrome的类型
declare namespace chrome {
  export namespace runtime {
    export function getContexts(options: {
      contextTypes: string[];
    }): Promise<Context[]>;

    export interface ExtensionContext {
      contextId: number;
      contextType: string;
      documentId?: number;
      documentOrigin?: string;
      documentUrl?: string;
      incognito: boolean;
      frameId: number;
      windowId: number;
    }
  }
}
