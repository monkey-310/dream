declare module "html-pdf-node" {
  interface Options {
    format?: "A4" | "Letter" | "Legal" | string;
    width?: string | number;
    height?: string | number;
    margin?: {
      top?: string | number;
      right?: string | number;
      bottom?: string | number;
      left?: string | number;
    };
    landscape?: boolean;
    printBackground?: boolean;
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    path?: string;
  }

  interface File {
    content?: string;
    url?: string;
  }

  function generatePdf(file: File, options: Options): Promise<Buffer>;
  function generatePdfs(files: File[], options: Options): Promise<Buffer[]>;

  export = {
    generatePdf,
    generatePdfs,
  };
}
