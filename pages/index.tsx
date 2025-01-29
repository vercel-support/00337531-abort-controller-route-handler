import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const abortController = new AbortController();
  const signal = abortController.signal;
  function fetchWithAbortController() {
    fetch('/api/stream', { signal }).then((response) => {
      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }
      const decoder = new TextDecoder();
      let buffer = '';
      reader.read().then(function processText(
        { done, value }: ReadableStreamReadResult<Uint8Array>
      ): Promise<void> {
        if (done) {
          return Promise.resolve();
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop() || '';
        for (const part of parts) {
          console.log(part, buffer);
        }
        return reader.read().then(processText);
      });
    });
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={fetchWithAbortController}>Fetch</button>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() => {
          console.log('aborting');
          abortController.abort();
          console.log('aborted');
        }}
      >
        Abort
      </button>
    </main>
  );
}
