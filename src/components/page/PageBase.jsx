export default function PageBase({children,className=""}){

return(
<div
className={`
border border-gray-200
bg-white
rounded-md
p-5
mt-3
flex flex-col
h-[calc(100vh-110px)]
overflow-hidden
${className}
`}
>
{children}
</div>
);
}