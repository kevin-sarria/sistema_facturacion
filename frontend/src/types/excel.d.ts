declare module 'write-excel-file' {
  export default function writeXlsxFile(
    data: any[],
    options?: {
      columns?: { width?: number }[];
      fileName?: string;
      sheet?: string;
    }
  ): Promise<any>;
}

declare module 'write-excel-file/browser' {
  export default function writeXlsxFile(
    data: any[],
    options?: {
      columns?: { width?: number }[];
      fileName?: string;
      sheet?: string;
    }
  ): Promise<any>;
}

declare module 'read-excel-file' {
  export default function readXlsxFile(
    file: Blob | File | ArrayBuffer,
    options?: any
  ): Promise<any[][]>;
}

declare module 'read-excel-file/browser' {
  export default function readXlsxFile(
    file: Blob | File | ArrayBuffer,
    options?: any
  ): Promise<any[][]>;
}
