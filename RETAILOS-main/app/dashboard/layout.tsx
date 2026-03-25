import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RealtimeProvider from "@/components/providers/RealtimeProvider";
import { VoiceAgent } from "@/components/ai/VoiceAgent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background relative pb-16 md:pb-0">
      <RealtimeProvider />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
      {/* ElevenLabs voice agent — floats over entire dashboard */}
      <VoiceAgent />
    </div>
  );
}
