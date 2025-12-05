import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Premium Hardware Co.',
  description:
    'Get in touch with Premium Hardware Co. Contact our sales team, technical support, or send us your feedback.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
