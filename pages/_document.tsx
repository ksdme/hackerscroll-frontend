import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return {
      ...await Document.getInitialProps(ctx),
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@200;300;400;500;600;700&display=swap" />
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital@0;1&display=swap" rel="stylesheet" />
        </Head>

        <body className="font-sans">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
