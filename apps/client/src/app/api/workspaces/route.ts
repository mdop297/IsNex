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
    {
      id: '4',
      name: 'Innovation Lab',
      description: 'Experimental space for prototyping AI-driven features',
      documentsCount: 18,
      conversationsCount: 11,
      createdAt: '2024-04-05T13:10:00Z',
      updatedAt: '2024-11-28T09:45:00Z',
    },
    {
      id: '5',
      name: 'Marketing Suite',
      description: 'Workspace for campaign planning, copy review, and insights',
      documentsCount: 30,
      conversationsCount: 22,
      createdAt: '2024-05-12T08:25:00Z',
      updatedAt: '2024-11-24T18:50:00Z',
    },
    {
      id: '6',
      name: 'AI Evaluation Center',
      description: 'Space for testing models, tracking evaluation metrics',
      documentsCount: 14,
      conversationsCount: 19,
      createdAt: '2024-06-03T10:00:00Z',
      updatedAt: '2024-11-27T07:30:00Z',
    },
    {
      id: '7',
      name: 'Strategic Archive',
      description: 'Long-term storage for executive summaries and plans',
      documentsCount: 42,
      conversationsCount: 9,
      createdAt: '2024-02-01T14:40:00Z',
      updatedAt: '2024-11-26T21:15:00Z',
    },
    {
      id: '8',
      name: 'Training & Onboarding',
      description: 'Guides, documentation, and Q&A for new team members',
      documentsCount: 16,
      conversationsCount: 6,
      createdAt: '2024-07-19T11:00:00Z',
      updatedAt: '2024-11-25T10:05:00Z',
    },
    {
      id: '9',
      name: 'Legal Review Hub',
      description: 'Workspace for compliance documents and contract discussion',
      documentsCount: 7,
      conversationsCount: 3,
      createdAt: '2024-08-29T17:20:00Z',
      updatedAt: '2024-11-24T12:40:00Z',
    },
    {
      id: '10',
      name: 'Growth Intelligence',
      description:
        'Data-centric workspace for analytics & performance insights',
      documentsCount: 21,
      conversationsCount: 13,
      createdAt: '2024-09-14T09:45:00Z',
      updatedAt: '2024-11-28T16:30:00Z',
    },
  ];

  return Response.json(workspaces);
}
