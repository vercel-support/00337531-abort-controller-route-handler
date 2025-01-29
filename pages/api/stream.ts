import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let count = 0;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  const intervalId = setInterval(() => {
    console.log(`Message number: ${count++}\n`);
  }, 500);

  res.on('close', () => {
    console.log('res close');
    clearInterval(intervalId);
    res.status(400).send('res close');
  });

  req.on('end', () => {
    console.log('req end');
    clearInterval(intervalId);
    res.status(400).send('req end');
  });

  req.on('close', () => {
    console.log('req close');
    clearInterval(intervalId);
    res.status(400).send('req close');
  });

  req.socket.on('close', () => {
    console.log('close');
    clearInterval(intervalId);
    res.status(400).send('req socket close');
  });

  req.socket.on('end', () => {
    console.log('end');
    clearInterval(intervalId);
    res.status(400).send('req socket end');
  });

  await new Promise((resolve) => setTimeout(resolve, 10000)).then(() => {
    clearInterval(intervalId);
    res.end();
  });
}
