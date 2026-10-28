import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, BUGS_TABLE } from '../src/config/aws.js';

const INITIAL_BUGS = [
  {
    id: "BUG-101",
    title: "Checkout payment button unresponsive on iOS Safari 17.4",
    description: "When users apply a discount coupon code in checkout and proceed to click 'Pay Now', the button enters a perpetual disabled state without sending the payment intent payload.",
    status: "qa",
    priority: "Critical",
    environment: "Staging",
    assignee: {
      name: "Sarah Jenkins",
      role: "QA Automation Engineer",
      avatarBg: "#FF5630",
      initials: "SJ"
    },
    reporter: {
      name: "Marcus Vance",
      avatarBg: "#0065FF",
      initials: "MV"
    },
    createdDate: "Today, 10:24 AM",
    createdAt: new Date().toISOString(),
    qaNotes: [
      {
        author: "Sarah Jenkins",
        note: "Reproduced in 4 out of 5 runs on iPhone 15 Pro emulator. Webkit touch handler conflict.",
        timestamp: "11:15 AM",
        createdAt: new Date().toISOString()
      }
    ],
    attachments: []
  },
  {
    id: "BUG-102",
    title: "Session token silently expires during multi-step invoice review",
    description: "Session refresh worker fails to ping authorization endpoint while modal is active, kicking QA testers back to login page without preserving draft inputs.",
    status: "qa",
    priority: "High",
    environment: "QA-Testbed",
    assignee: {
      name: "Alex Rivera",
      role: "Security & QA Specialist",
      avatarBg: "#6554C0",
      initials: "AR"
    },
    reporter: {
      name: "David Kim",
      avatarBg: "#36B37E",
      initials: "DK"
    },
    createdDate: "Yesterday, 3:45 PM",
    createdAt: new Date().toISOString(),
    qaNotes: [],
    attachments: []
  },
  {
    id: "BUG-104",
    title: "Dark mode contrast ratio fails WCAG AA standard on secondary pills",
    description: "Text color #8993A4 on background #253858 yields a contrast ratio of only 2.8:1 instead of required 4.5:1.",
    status: "done",
    priority: "Low",
    environment: "QA-Testbed",
    assignee: {
      name: "Marcus Vance",
      role: "Frontend Engineer",
      avatarBg: "#0065FF",
      initials: "MV"
    },
    reporter: {
      name: "Elena Rostova",
      avatarBg: "#FFAB00",
      initials: "ER"
    },
    createdDate: "Oct 25, 11:00 AM",
    createdAt: new Date().toISOString(),
    qaNotes: [
      {
        author: "Marcus Vance",
        note: "Updated tokens to high-contrast palette (#DEEBFF on #091E42). Ready for final approval.",
        timestamp: "Yesterday, 5:30 PM",
        createdAt: new Date().toISOString()
      }
    ],
    attachments: []
  },
  {
    id: "BUG-106",
    title: "OAuth Google sign-in redirect URI mismatch on production deployment",
    description: "Fixed redirect URL mismatch where backend callback was missing port 443 specifier under SSL proxy terminating layer.",
    status: "approved",
    priority: "Critical",
    environment: "Production",
    assignee: {
      name: "David Kim",
      role: "Principal QA Lead",
      avatarBg: "#36B37E",
      initials: "DK"
    },
    reporter: {
      name: "Sarah Jenkins",
      avatarBg: "#FF5630",
      initials: "SJ"
    },
    createdDate: "Oct 23, 9:00 AM",
    createdAt: new Date().toISOString(),
    qaNotes: [
      {
        author: "David Kim",
        note: "Production smoke test passed across Chrome, Safari, Firefox, and Edge. Signed off for release v2.4.1.",
        timestamp: "Oct 24, 11:30 AM",
        createdAt: new Date().toISOString()
      }
    ],
    attachments: []
  }
];

async function seed() {
  console.log(`🌱 Seeding DynamoDB table: ${BUGS_TABLE}...`);

  for (const bug of INITIAL_BUGS) {
    try {
      await dynamoDb.send(new PutCommand({
        TableName: BUGS_TABLE,
        Item: bug
      }));
      console.log(`✅ Seeded: ${bug.id} - ${bug.title.slice(0, 40)}... [Status: ${bug.status}]`);
    } catch (err) {
      console.error(`❌ Failed to seed ${bug.id}:`, err.message);
    }
  }

  console.log('🎉 Seeding completed!');
}

seed();
