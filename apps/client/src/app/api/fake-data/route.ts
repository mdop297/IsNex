import fakeData from '@/data/fake_data.json';

export async function GET() {
  await new Promise((res) => setTimeout(res, 500));
  return Response.json({
    documents: fakeData.documents,
    conversations: fakeData.conversations,
  });
}
