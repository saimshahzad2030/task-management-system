import UserTaskHeader from '@/components/UserTasksHeader/UserTaskHeader';
import UserTaskTable from '@/components/UserTaskTable/UserTaskTable';
import { cookies } from "next/headers";

import { notFound } from "next/navigation";
import { config } from '../../../../config/config';
import axios from 'axios';
import { fetchSpecificTemplate } from '@/services/adminTemplate.services';

export default async function UserTasksPage({
params,
}: {
params: Promise<{ templateId: string }>;
}) {
const { templateId } = await params;
 
// Fetch template from backend
const cookieStore = await cookies();
const token = cookieStore.get("accessToken")?.value;
const res = await fetchSpecificTemplate(Number(templateId),token);
  console.log(token)
if (res.status!==200) {
// If backend returns 404 or error → show default Next.js 404
notFound();
}
const template = await res.data;
console.log(res.data.steps)

// ❌ Extra safety: if template is null or empty
if (!template || !template.id) {
notFound();
}
 

return ( <div className="flex flex-col items-start w-full p-8"> <UserTaskHeader adminTemplate={template} /> <UserTaskTable adminTemplate={template} /> </div>
);
}
