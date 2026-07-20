import{useLayoutEffect,useMemo,useRef,useState}from"react";
import{Calendar,ChevronLeft,ChevronRight}from"lucide-react";

const VISIBLE_CARDS=4;
const CLONE_COUNT=4;
const GAP=14;
const EDGE_SPACE=8;
const CARD_HEIGHT=140;

const status=value=>{
if(!value||value==="To Do")return"Pending";
if(value==="In Progress")return"Ongoing";
return value;
};

const statusStyle=value=>{
const current=status(value);

if(current==="Ongoing"){
return"border-red-200 bg-red-50 text-red-600";
}

if(current==="Overdue"){
return"border-red-600 bg-red-600 text-white";
}

return"border-black/10 bg-black/[0.05] text-black";
};

export default function MyTasksTable({tasks=[]}){
const viewportRef=useRef(null);
const movingRef=useRef(false);
const touchStartRef=useRef(null);

const[index,setIndex]=useState(CLONE_COUNT);
const[cardWidth,setCardWidth]=useState(0);
const[animated,setAnimated]=useState(false);
const[hoveredArrow,setHoveredArrow]=useState(null);

const items=useMemo(()=>{
if(!tasks.length)return[];

const count=Math.max(tasks.length,VISIBLE_CARDS);

return Array.from(
{length:count},
(_,itemIndex)=>tasks[itemIndex%tasks.length]
);
},[tasks]);

const cards=useMemo(()=>{
if(!items.length)return[];

return[
...items.slice(-CLONE_COUNT),
...items,
...items.slice(0,CLONE_COUNT)
];
},[items]);

useLayoutEffect(()=>{
const viewport=viewportRef.current;
if(!viewport)return;

const measure=()=>{
const availableWidth=viewport.clientWidth-(EDGE_SPACE*2);
const totalGap=GAP*(VISIBLE_CARDS-1);
const calculatedWidth=(availableWidth-totalGap)/VISIBLE_CARDS;

setCardWidth(Math.max(0,calculatedWidth));
};

measure();

const observer=new ResizeObserver(measure);
observer.observe(viewport);

return()=>observer.disconnect();
},[]);

useLayoutEffect(()=>{
movingRef.current=false;
setAnimated(false);
setIndex(CLONE_COUNT);

let secondFrame;

const firstFrame=requestAnimationFrame(()=>{
secondFrame=requestAnimationFrame(()=>{
setAnimated(true);
});
});

return()=>{
cancelAnimationFrame(firstFrame);

if(secondFrame){
cancelAnimationFrame(secondFrame);
}
};
},[items.length]);

const move=direction=>{
if(!items.length||!cardWidth||movingRef.current)return;

movingRef.current=true;
setAnimated(true);
setIndex(current=>current+direction);
};

const finishMove=()=>{
if(!items.length)return;

if(index>=CLONE_COUNT+items.length){
setAnimated(false);
setIndex(index-items.length);
}else if(index<CLONE_COUNT){
setAnimated(false);
setIndex(index+items.length);
}

movingRef.current=false;
};

const handleTouchStart=event=>{
touchStartRef.current=event.touches[0]?.clientX??null;
};

const handleTouchEnd=event=>{
if(touchStartRef.current===null)return;

const endX=event.changedTouches[0]?.clientX;
const difference=touchStartRef.current-endX;

touchStartRef.current=null;

if(Math.abs(difference)<35)return;

move(difference>0?1:-1);
};

if(!tasks.length){
return(
<div
className="flex w-full items-center justify-center rounded-xl border border-black/10 bg-white text-xs text-black/40"
style={{height:`${CARD_HEIGHT}px`}}
>
No tasks available
</div>
);
}

const step=cardWidth+GAP;
const translate=index*step;

return(
<div
className="relative w-full min-w-0"
style={{touchAction:"pan-y"}}
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
>

<div
className="absolute inset-y-0 left-0 z-30 flex w-16 items-center justify-start"
onMouseEnter={()=>setHoveredArrow("left")}
onMouseLeave={()=>setHoveredArrow(null)}
>
<button
type="button"
aria-label="Previous task"
onClick={()=>move(-1)}
className={`flex h-14 w-12 items-center justify-center transition-all duration-200 ${
hoveredArrow==="left"
?"pointer-events-auto translate-x-0 opacity-100"
:"pointer-events-none -translate-x-2 opacity-0"
}`}
>
<ChevronLeft
size={44}
strokeWidth={2.8}
className="text-black/70 drop-shadow-[0_1px_1px_rgba(255,255,255,1)] transition hover:scale-110 hover:text-red-600"
/>
</button>
</div>

<div
className="absolute inset-y-0 right-0 z-30 flex w-16 items-center justify-end"
onMouseEnter={()=>setHoveredArrow("right")}
onMouseLeave={()=>setHoveredArrow(null)}
>
<button
type="button"
aria-label="Next task"
onClick={()=>move(1)}
className={`flex h-14 w-12 items-center justify-center transition-all duration-200 ${
hoveredArrow==="right"
?"pointer-events-auto translate-x-0 opacity-100"
:"pointer-events-none translate-x-2 opacity-0"
}`}
>
<ChevronRight
size={44}
strokeWidth={2.8}
className="text-black/70 drop-shadow-[0_1px_1px_rgba(255,255,255,1)] transition hover:scale-110 hover:text-red-600"
/>
</button>
</div>

<div
ref={viewportRef}
className="w-full min-w-0 overflow-hidden py-2"
>
<div
className="flex"
onTransitionEnd={event=>{
if(event.target===event.currentTarget){
finishMove();
}
}}
style={{
gap:`${GAP}px`,
paddingLeft:`${EDGE_SPACE}px`,
paddingRight:`${EDGE_SPACE}px`,
transform:`translate3d(-${translate}px,0,0)`,
transition:animated?"transform 350ms ease":"none",
visibility:cardWidth>0?"visible":"hidden"
}}
>
{cards.map((task,itemIndex)=>(
<div
key={`${task._id||"task"}-${itemIndex}`}
className="relative box-border min-w-0 shrink-0 overflow-hidden rounded-xl border border-black/[0.09] bg-white p-4 shadow-[0_3px_7px_rgba(0,0,0,0.11)] transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-[0_5px_10px_rgba(0,0,0,0.14)]"
style={{
width:`${cardWidth}px`,
height:`${CARD_HEIGHT}px`
}}
>
<div className="absolute inset-x-0 top-0 h-[3px] bg-red-600"/>

<div className="relative z-10 min-w-0">
<h3 className="truncate text-xs font-bold text-black/80">
{task.subject||"Untitled Task"}
</h3>

<p className="mt-1 truncate text-[10px] font-medium text-black/40">
{task.taskType||"Task"}
</p>

<span
className={`mt-3 inline-flex max-w-full truncate rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle(task.status)}`}
>
{status(task.status)}
</span>

<div className="mt-4 flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-black/60">
<Calendar size={12} className="shrink-0 text-red-600"/>

<span className="truncate">
{task.dueDate
?new Date(task.dueDate).toLocaleDateString(
"en-US",
{month:"short",day:"numeric"}
)
:"No date"}
</span>
</div>
</div>
</div>
))}
</div>
</div>
</div>
);
}