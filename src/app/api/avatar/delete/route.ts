import { del, list } from '@vercel/blob';
 
export const runtime = 'edge';
 
export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
  const lists = await list()

console.log(lists)
//   await del();
 
  return new Response();
}