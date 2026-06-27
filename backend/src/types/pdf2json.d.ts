declare module 'pdf2json' {
  interface PDFParserData {
    Pages: Array<{
      Texts: Array<{
        R: Array<{ T: string }>
      }>
    }>
  }

  class PDFParser {
    constructor()
    on(event: 'pdfParser_dataReady', callback: (pdfData: PDFParserData) => void): void
    on(event: 'pdfParser_dataError', callback: (error: any) => void): void
    parseBuffer(buffer: Buffer): void
  }

  export = PDFParser
}