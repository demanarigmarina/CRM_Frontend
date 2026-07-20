import{useLayoutEffect,useMemo,useRef,useState}from"react";
import{CalendarDays,Clock,ChevronLeft,ChevronRight}from"lucide-react";

const VISIBLE_CARDS=4;
const CLONE_COUNT=4;
const GAP=12;
const PEEK=22;

export default function MyMeetingsTable({meetings=[]}){
const viewportRef=useRef(null);
const movingRef=useRef(false);

const[index,setIndex]=useState(CLONE_COUNT);
const[cardWidth,setCardWidth]=useState(0);
const[animated,setAnimated]=useState(false);
const[showArrows,setShowArrows]=useState(false);

const items=useMemo(()=>{
if(!meetings.length)return[];

const count=Math.max(meetings.length,VISIBLE_CARDS);

return Array.from(
{length:count},
(_,itemIndex)=>meetings[itemIndex%meetings.length]
);
},[meetings]);

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
const available=viewport.clientWidth-(PEEK*2);
const gaps=GAP*(VISIBLE_CARDS-1);

setCardWidth(
Math.max(0,(available-gaps)/VISIBLE_CARDS)
);
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

if(!meetings.length){
return(
<div className="flex h-[140px] w-full items-center justify-center rounded-xl border border-black/10 bg-white text-xs text-black/40">
No meetings available
</div>
);
}

const step=cardWidth+GAP;
const translate=(index*step)-PEEK;

return(
<div
className="group relative w-full min-w-0"
onMouseEnter={()=>setShowArrows(true)}
onMouseLeave={()=>setShowArrows(false)}
>

<button
type="button"
aria-label="Previous meeting"
onClick={()=>move(-1)}
className={`absolute left-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-black/60 transition-all hover:scale-110 hover:text-red-600 ${
showArrows
?"opacity-100"
:"pointer-events-none opacity-0"
}`}
>
<ChevronLeft size={44} strokeWidth={2.7}/>
</button>

<button
type="button"
aria-label="Next meeting"
onClick={()=>move(1)}
className={`absolute right-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-black/60 transition-all hover:scale-110 hover:text-red-600 ${
showArrows
?"opacity-100"
:"pointer-events-none opacity-0"
}`}
>
<ChevronRight size={44} strokeWidth={2.7}/>
</button>

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
transform:`translate3d(-${translate}px,0,0)`,
transition:animated?"transform 380ms ease":"none",
visibility:cardWidth>0?"visible":"hidden"
}}
>

{cards.map((meeting,itemIndex)=>(

<div
key={`${meeting._id||"meeting"}-${itemIndex}`}
className="
relative
box-border
h-[140px]
min-w-0
shrink-0
overflow-hidden
rounded-xl
border
border-black/[0.09]
bg-white
p-4
shadow-[0_3px_7px_rgba(0,0,0,0.11)]
transition
duration-300
hover:-translate-y-0.5
hover:border-red-200
hover:shadow-[0_5px_10px_rgba(0,0,0,0.14)]
"
style={{width:`${cardWidth}px`}}
>

<div className="absolute inset-x-0 top-0 h-[3px] bg-red-600"/>

<div className="relative z-10">

<h3 className="truncate text-[12px] font-bold text-black/80">
{meeting.meetingTitle||"Untitled Meeting"}
</h3>

<div className="mt-4 space-y-3 text-[10px] font-medium text-black/60">

<div className="flex min-w-0 items-center gap-2">

<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
<CalendarDays size={12}/>
</span>

<span className="truncate">
{meeting.date
?new Date(meeting.date).toLocaleDateString(
"en-US",
{
month:"short",
day:"numeric"
}
)
:"No date"}
</span>

</div>

<div className="flex min-w-0 items-center gap-2">

<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/[0.05] text-black/70">
<Clock size={12}/>
</span>

<span className="truncate">
{meeting.startTime||"--"} - {meeting.endTime||"--"}
</span>

</div>

</div>

</div>

</div>

))}

</div>

</div>

</div>
);
}