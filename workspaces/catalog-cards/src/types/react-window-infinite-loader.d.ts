declare module 'react-window-infinite-loader' {
  import { ComponentType, ReactNode } from 'react';

  export interface InfiniteLoaderProps {
    isItemLoaded: (index: number) => boolean;
    itemCount: number;
    loadMoreItems: (
      startIndex: number,
      stopIndex: number,
    ) => Promise<void> | void;
    threshold?: number;
    minimumBatchSize?: number;
    children: (props: {
      onItemsRendered: (props: {
        startIndex: number;
        stopIndex: number;
      }) => void;
      ref: React.Ref<any>;
    }) => ReactNode;
  }

  declare const InfiniteLoader: ComponentType<InfiniteLoaderProps>;
  export default InfiniteLoader;
}
