export const INITIAL_BUGS = [
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
    qaNotes: [
      {
        author: "Sarah Jenkins",
        note: "Reproduced in 4 out of 5 runs on iPhone 15 Pro emulator. Webkit touch handler conflict.",
        timestamp: "11:15 AM"
      }
    ]
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
    qaNotes: []
  },
  {
    id: "BUG-103",
    title: "Exported CSV contains corrupted UTF-8 characters for German umlauts",
    description: "Downloading the user audit log results in 'MÃ¼ller' instead of 'Müller' due to missing BOM headers in the streaming response.",
    status: "qa",
    priority: "Medium",
    environment: "Staging",
    assignee: {
      name: "Elena Rostova",
      role: "QA Analyst",
      avatarBg: "#FFAB00",
      initials: "ER"
    },
    reporter: {
      name: "Sarah Jenkins",
      avatarBg: "#FF5630",
      initials: "SJ"
    },
    createdDate: "Oct 26, 2:10 PM",
    qaNotes: []
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
    qaNotes: [
      {
        author: "Marcus Vance",
        note: "Updated tokens to high-contrast palette (#DEEBFF on #091E42). Ready for final approval.",
        timestamp: "Yesterday, 5:30 PM"
      }
    ]
  },
  {
    id: "BUG-105",
    title: "Avatar image upload error handling crashes profile view on 413 payload",
    description: "When testing boundary conditions with a 25MB PNG file, the upload client threw uncaught runtime promise rejections instead of showing toast error banner.",
    status: "done",
    priority: "High",
    environment: "Staging",
    assignee: {
      name: "Sarah Jenkins",
      role: "QA Automation Engineer",
      avatarBg: "#FF5630",
      initials: "SJ"
    },
    reporter: {
      name: "Alex Rivera",
      avatarBg: "#6554C0",
      initials: "AR"
    },
    createdDate: "Oct 24, 4:20 PM",
    qaNotes: [
      {
        author: "Sarah Jenkins",
        note: "Client-side pre-validation added. Tested with 35MB file, warning toast triggers cleanly.",
        timestamp: "Today, 9:15 AM"
      }
    ]
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
    qaNotes: [
      {
        author: "David Kim",
        note: "Production smoke test passed across Chrome, Safari, Firefox, and Edge. Signed off for release v2.4.1.",
        timestamp: "Oct 24, 11:30 AM"
      }
    ]
  },
  {
    id: "BUG-107",
    title: "Websocket reconnection exponential backoff prevents server DDOS on network drops",
    description: "Live notification socket was repeatedly retrying every 100ms when offline. Backoff strategy implemented and validated under network throttling.",
    status: "approved",
    priority: "Medium",
    environment: "Production",
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
    createdDate: "Oct 22, 1:15 PM",
    qaNotes: [
      {
        author: "Alex Rivera",
        note: "Simulated 500 parallel offline clients. Reconnection spike dropped from 94% CPU to 12% CPU. Approved.",
        timestamp: "Oct 23, 4:00 PM"
      }
    ]
  }
];

export const STAGES = [
  {
    id: "qa",
    label: "QA",
    subtitle: "In QA Testing & Verification",
    badgeColor: "#0052CC",
    badgeBg: "#DEEBFF",
    borderHighlight: "#4C9AFF",
    icon: "Bug"
  },
  {
    id: "done",
    label: "Done",
    subtitle: "QA Resolved & Passed",
    badgeColor: "#5243AA",
    badgeBg: "#EAE6FF",
    borderHighlight: "#8777D9",
    icon: "CheckCircle2"
  },
  {
    id: "approved",
    label: "Approved",
    subtitle: "Verified & Signed Off",
    badgeColor: "#006644",
    badgeBg: "#E3FCEF",
    borderHighlight: "#36B37E",
    icon: "ShieldCheck"
  }
];

export const PRIORITIES = [
  { label: "Critical", color: "#DE350B", bg: "#FFEBE6", iconColor: "#DE350B" },
  { label: "High", color: "#FF5630", bg: "#FFF0B3", iconColor: "#FF5630" },
  { label: "Medium", color: "#FF8B00", bg: "#FFFAE6", iconColor: "#FFAB00" },
  { label: "Low", color: "#006644", bg: "#E3FCEF", iconColor: "#36B37E" }
];
