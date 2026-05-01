import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import NewPostForm from './NewPostForm';

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect('/famille/login?next=/famille/new');
  const sp = await searchParams;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Nouvelle publication</h2>
      <NewPostForm initialError={sp.error === 'missing' ? 'Type, titre et message sont requis.' : undefined} />
    </div>
  );
}
