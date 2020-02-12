declare namespace GridStylModule {
  export interface IGridStyl {
    test: string;
  }
}

declare const GridStylModule: GridStylModule.IGridStyl & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GridStylModule.IGridStyl;
};

export = GridStylModule;
