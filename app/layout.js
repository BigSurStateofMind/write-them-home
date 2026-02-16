import './globals.css';

export const metadata = {
  title: 'Write Them Home',
  description: 'An AI-assisted letter-writing campaign to stop ICE warehouse detention facilities.',
  openGraph: {
    title: 'Write Them Home',
    description: 'One writing session. Dozens of personalized letters to decision-makers opposing ICE warehouse detention.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
