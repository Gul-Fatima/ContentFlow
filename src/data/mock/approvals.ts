import type { Approval } from '../../types/content';

export const MOCK_APPROVALS: Approval[] = [
  {
    id: '1',
    platform: 'twitter',
    title:
      "🚀 AI is changing how we work, but it's not replacing creativity. It's amplifying it. Here are 3 ways to use AI as your creative partner, not your replacement. 🧵👇 #AI #Creativity #FutureOfWork",
    body:
      "🚀 AI is changing how we work, but it's not replacing creativity. It's amplifying it. Here are 3 ways to use AI as your creative partner, not your replacement. 🧵👇 #AI #Creativity #FutureOfWork",
    aiReasoning:
      'Aligns with "Thought Leadership" goal. Uses trending hashtags and thread format for higher engagement.',
    scheduledFor: '2026-02-10T09:00:00.000Z',
    scheduledLabel: 'Tomorrow, 9:00 AM',
    status: 'pending',
    author: 'Agent',
    tone: 92,
  },
  {
    id: '2',
    platform: 'linkedin',
    title:
      'Excited to announce our new integration with Slack! Now you can manage your social approvals directly from your team channels. \n\nProductivity just got a major upgrade. 📈\n\nCheck out the link in comments to learn more.',
    body:
      'Excited to announce our new integration with Slack! Now you can manage your social approvals directly from your team channels. \n\nProductivity just got a major upgrade. 📈\n\nCheck out the link in comments to learn more.',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    aiReasoning:
      'Product launch announcement. Professional tone matched to LinkedIn audience.',
    scheduledFor: '2026-02-11T14:00:00.000Z',
    scheduledLabel: 'Wed, 2:00 PM',
    status: 'pending',
    author: 'Agent',
    tone: 92,
  },
  {
    id: '3',
    platform: 'instagram',
    title:
      'Behind the scenes at our annual retreat! 🌲✨ \n\nBuilding the future of social media management takes a village (and some fresh air). \n\n#CompanyCulture #Startuplife #TeamBuilding',
    body:
      'Behind the scenes at our annual retreat! 🌲✨ \n\nBuilding the future of social media management takes a village (and some fresh air). \n\n#CompanyCulture #Startuplife #TeamBuilding',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    aiReasoning:
      'Humanizing the brand. Visual content performs best on Instagram.',
    scheduledFor: '2026-02-13T17:00:00.000Z',
    scheduledLabel: 'Fri, 5:00 PM',
    status: 'pending',
    author: 'Agent',
    tone: 92,
  },
  {
    id: '4',
    platform: 'email',
    title:
      "Subject: Your Weekly Social Performance Report 📊\n\nHi Team,\n\nHere are the key highlights from last week's social media performance:\n\n- Total Reach: +15%\n- Engagement Rate: 4.2%\n- Top Post: \"5 Tips for Better Copywriting\"\n\nRead the full report in your dashboard.",
    body:
      "Subject: Your Weekly Social Performance Report 📊\n\nHi Team,\n\nHere are the key highlights from last week's social media performance:\n\n- Total Reach: +15%\n- Engagement Rate: 4.2%\n- Top Post: \"5 Tips for Better Copywriting\"\n\nRead the full report in your dashboard.",
    aiReasoning:
      'Weekly stakeholder update email. Concise and data-driven.',
    scheduledFor: '2026-02-16T08:00:00.000Z',
    scheduledLabel: 'Mon, 8:00 AM',
    status: 'pending',
    author: 'Agent',
    tone: 92,
  },
];
