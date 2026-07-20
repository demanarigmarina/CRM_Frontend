export default function DashboardCard({
icon:Icon,
title,
children,
className=""
}){

return(
<div className={`rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md ${className}`}>

{Icon&&(
<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
<Icon size={20}/>
</div>
)}

{title&&(
<h3 className="mb-3 text-sm font-semibold text-gray-800">
{title}
</h3>
)}

{children}

</div>
);

}