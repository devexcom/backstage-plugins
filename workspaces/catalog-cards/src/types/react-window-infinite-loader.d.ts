declare module 'react-window-infinite-loader' {
  import { ComponentType } from 'react';
  import { ListChildComponentProps } from 'react-window';

  export interface InfiniteLoaderProps {
    isItemLoaded: (index: number) => boolean;
    itemCount: number;
    loadMoreItems: (
      startIndex: number,
      stopIndex: number,
    ) => Promise<void> | void;
    threshold?: number;
    minimumBatchSize?: number;
    children: ComponentType<any>;
  }

  export default class InfiniteLoader extends ComponentType<InfiniteLoaderProps> {}
}
