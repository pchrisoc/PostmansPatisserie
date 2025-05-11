declare module 'exif-parser' {
  interface ExifTags {
    Make?: string;
    Model?: string;
    DateTime?: number;
    DateTimeOriginal?: number;
    CreateDate?: number;
    ModifyDate?: number;
    Orientation?: number;
    GPSLatitude?: number;
    GPSLongitude?: number;
    GPSAltitude?: number;
    // Use unknown instead of any to be more type-safe
    [key: string]: unknown;
  }

  interface ExifResult {
    tags: ExifTags;
    imageSize?: {
      height: number;
      width: number;
    };
  }

  interface Parser {
    parse(): ExifResult;
  }

  function create(buffer: Buffer): Parser;

  export = {
    create
  };
}