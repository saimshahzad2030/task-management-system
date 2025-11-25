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
 
  const template = adminTemplates.find(t => t.id == templateId);

  // ❌ If not found → show default Next.js 404 page
  if (!template) {
    notFound();
  }
  console.log(template.id)
  return (
    <div className='flex flex-col items-start w-full p-8'>
      <UserTaskHeader adminTemplate={template}/>
      <UserTaskTable adminTemplate={template}/>
    </div>
  )
} 