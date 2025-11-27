// Type definitions
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isLiked?: boolean;
  isDisliked?: boolean;
}

// Sample messages data
const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    content: 'Hey! Can you tell me about *flying dragons*? 🐉',
    timestamp: new Date('2025-07-19T18:00:00Z'),
  },
  {
    id: '2',
    type: 'bot',
    content:
      "Hello! **Flying dragons** are *mythical creatures* full of wonder! Here's what they might be like:\n\n- **Soaring through the skies** with mighty wings.\n- *Breathing fire* to light up the night.\n- Powered by `magical energy` to fly at incredible speeds.\n\nWant to learn more? Check out [this mythical guide](https://example.com/flying-dragons)!\n\nHere's a fictional code snippet to summon a dragon:\n```javascript\nfunction summonDragon() {\n  const dragon = {\n    name: 'FireWing',\n    power: 500,\n    fly: () => console.log('Roar! I\\'m soaring!')\n  };\n  return dragon;\n}\n```\nWould you like to hear about *talking wolves* next?",
    timestamp: new Date('2025-07-19T18:00:30Z'),
    isLiked: true,
    isDisliked: false,
  },
  {
    id: '3',
    type: 'user',
    content: 'Haha, dragons are awesome! What about **singing mountains**?',
    timestamp: new Date('2025-07-19T18:01:00Z'),
  },
  {
    id: '4',
    type: 'bot',
    content:
      "Singing mountains? 🏔️ **What a fantastic idea!** Here's the lowdown:\n\n1. **Harmonic vibrations**: Mountains sing through *natural resonance* caused by wind.\n2. *Unique ranges*: Only the `Melodic Peaks` have this ability.\n3. **Visual effects**: Their peaks glow 🌟 in rhythm with the song.\n\nExample code to interact with a singing mountain:\n```python\nclass SingingMountain:\n    def __init__(self):\n        self.song = 'Hummm~'\n\n    def sing(self, wind_speed):\n        return f'{self.song} at {wind_speed} mph!'\n\nmountain = SingingMountain()\nprint(mountain.sing(10))\n```\nWant me to write a poem about singing mountains? 😊",
    timestamp: new Date('2025-07-19T18:01:30Z'),
    isLiked: false,
    isDisliked: false,
  },
  {
    id: '5',
    type: 'user',
    content: 'Singing mountains sound epic! Write that poem, please!',
    timestamp: new Date('2025-07-19T18:02:00Z'),
  },
  {
    id: '6',
    type: 'bot',
    content:
      "Đây là `đoạn văn bản` trước.\n___\nĐây là đoạn văn bản sau.\nHere's a poem about **singing mountains**:\n\n> **The Song of the Peaks**\n> \n> *Winds whisper, mountains hum,* \n> **Echoes rise**, their anthem comes.  \n> Each ridge a note, each peak a tune,  \n> *Glowing bright* beneath the moon.\n\n- **Chorus**: The mountains sing under starlight. 🌠\n- **Tip**: Listen at dusk for the *full magic*!\n\nChúng ta có thể biểu diễn đạo hàm của hàm số $f(x)$ là $f'(x)$ hoặc $\\frac{df}{dx}$.\n\n### Ví dụ về phương trình Laplace\n\nPhương trình Laplace trong không gian 3 chiều là:\n\n$$\\nabla^2 V = \\frac{\\partial^2 V}{\\partial x^2} + \\frac{\\partial^2 V}{\\partial y^2} + \\frac{\\partial^2 V}{\\partial z^2} = 0$$\n\nĐiều này rất quan trọng trong vật lý và kỹ thuật.\n\nHow about a comparison table between *flying dragons* and *singing mountains*?\n| Feature | Flying Dragons | Singing Mountains |\n|---------|----------------|------------------|\n| Ability | Fire-breathing flight | Singing resonance |\n| Power Source | Magic wings | Wind |\n| Rarity | **Super rare** | *Ultra rare* |\n\nCurious about *dancing phoenixes*? 🦅\n\n ",
    timestamp: new Date('2025-07-19T18:02:30Z'),
    isLiked: true,
    isDisliked: false,
  },
];

export { sampleMessages, type Message };
