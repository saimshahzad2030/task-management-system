import UserTaskHeader from '@/components/UserTasksHeader/UserTaskHeader'
import UserTaskTable from '@/components/UserTaskTable/UserTaskTable'
import { adminTemplates } from '@/global/constant'
import { notFound } from "next/navigation";
 
export default async function UserTasksPage({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
    const { templateId } = await params;
  const index = Number(templateId);

  const template = adminTemplates[index];

  // ❌ If not found → show default Next.js 404 page
  if (!template) {
    notFound();
  }
  return (
    <div className='flex flex-col items-start w-full p-8'>
      <UserTaskHeader adminTemplate={adminTemplates[index]}/>
      <UserTaskTable adminTemplate={adminTemplates[index]}/>
    </div>
  )
} 