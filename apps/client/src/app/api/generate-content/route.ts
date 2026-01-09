import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // const apiKey = process.env.ANTHROPIC_API_KEY;
    // if (!apiKey) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         'Chưa cấu hình API key. Vui lòng thêm ANTHROPIC_API_KEY trong Vars section.',
    //     },
    //     { status: 401 },
    //   );
    // }

    const { text, count, type } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (type === 'quiz') {
      const mockQuestions = Array.from({ length: count }, (_, i) => ({
        question: `Câu ${i + 1}: Đây là câu hỏi về "${text.substring(0, 30)}..."?`,
        options: [
          `A. Đáp án thứ nhất cho câu ${i + 1}`,
          `B. Đáp án thứ hai cho câu ${i + 1}`,
          `C. Đáp án thứ ba cho câu ${i + 1}`,
          `D. Đáp án thứ tư cho câu ${i + 1}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `Đây là giải thích chi tiết cho câu hỏi ${i + 1}. Dựa trên văn bản: "${text.substring(0, 50)}..."`,
      }));

      return NextResponse.json({ questions: mockQuestions });
    } else {
      const mockFlashcards = Array.from({ length: count }, (_, i) => ({
        front: `Khái niệm ${i + 1}: ${text.substring(0, 40)}...`,
        back: `Định nghĩa chi tiết cho khái niệm ${i + 1}. Đây là phần giải thích về nội dung từ văn bản: "${text.substring(0, 60)}..."`,
      }));

      return NextResponse.json({ flashcards: mockFlashcards });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 },
    );
  }
}
