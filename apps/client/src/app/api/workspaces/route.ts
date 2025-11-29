export async function GET() {
  // Mock workspace data
  const workspaces = [
    {
      id: '1',
      name: 'Project Alpha',
      description:
        'Main project workspace for content management and AI analysis',
      documentsCount: 12,
      conversationsCount: 8,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-11-25T14:20:00Z',
    },
    {
      id: '2',
      name: 'Research Hub',
      description: 'Dedicated workspace for research documents and discussions',
      documentsCount: 24,
      conversationsCount: 15,
      createdAt: '2024-02-20T09:15:00Z',
      updatedAt: '2024-11-27T11:45:00Z',
    },
    {
      id: '3',
      name: 'Client Portal',
      description: 'Client-facing workspace for project collaboration',
      documentsCount: 8,
      conversationsCount: 5,
      createdAt: '2024-03-10T16:00:00Z',
      updatedAt: '2024-11-26T15:30:00Z',
    },
  ];

  return Response.json(workspaces);
}
