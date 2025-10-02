'use client';

import Tasks from '@/components/Tasks';
import { Logout } from '@/components/Auth';

export default function TaskPage() {
  return (
    <>
      <Tasks />
      <Logout />
    </>
  );
}
