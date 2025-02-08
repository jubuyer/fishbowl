import Image from "next/image";
import { SignIn } from '@clerk/nextjs';

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn />
    </div>
  );
}
