const STORAGE_KEY = "taskflow_tasks_v1";
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const sampleTasks = [
 {id:crypto.randomUUID(),title:"Review lecture notes",description:"Go through the notes from this week's classes.",date:todayISO(),priority:"High",category:"Study",completed:false},
 {id:crypto.randomUUID(),title:"Plan the week ahead",description:"Write down the most important goals for the week.",date:todayISO(),priority:"Medium",category:"Personal",completed:false},
 {id:crypto.randomUUID(),title:"Take a short evening walk",description:"Make a little time to recharge.",date:addDays(1),priority:"Low",category:"Health",completed:true},
 {id:crypto.randomUUID(),title:"Finish project outline",description:"Prepare the first draft of the project plan.",date:addDays(2),priority:"High",category:"Work",completed:false}
];
let tasks = loadTasks();
let currentScreen = "dashboard";
let calendarCursor = new Date();
let selectedDate = todayISO();
function loadTasks(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):sampleTasks;}catch{return sampleTasks;}}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function prettyDate(iso){if(!iso)return "";return new Date(iso+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);}
function navigate(screen){currentScreen=screen;document.querySelectorAll(".screen").forEach(el=>el.classList.toggle("active",el.id===`screen-${screen}`));document.querySelectorAll(".nav-link[data-screen]").forEach(el=>el.classList.toggle("active",el.dataset.screen===screen));const labels={dashboard:"Dashboard",tasks:"My Tasks",add:"Add Task",calendar:"Calendar",settings:"Settings"};document.getElementById("breadcrumbCurrent").textContent=labels[screen];if(screen==="calendar")renderCalendar();if(screen==="tasks")renderAllTasks();if(screen==="dashboard")renderDashboard();if(screen==="add"&&!document.getElementById("editId").value)resetForm();window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.screen)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
function taskMarkup(task){return `<article class="task-item ${task.completed?"is-complete":""}"><button class="task-check ${task.completed?"checked":""}" data-action="toggle" data-id="${task.id}" aria-label="${task.completed?"Mark incomplete":"Mark complete"}">${task.completed?"✓":""}</button><div class="task-info"><span class="task-title">${escapeHTML(task.title)}</span>${task.description?`<span class="task-description">${escapeHTML(task.description)}</span>`:""}<div class="task-meta"><span class="priority ${task.priority}">${task.priority} priority</span><span class="category-tag">${escapeHTML(task.category)}</span><span class="task-date">${prettyDate(task.date)}</span></div></div><div class="task-actions"><button class="mini-action" title="Edit task" data-action="edit" data-id="${task.id}">✎</button><button class="mini-action" title="Delete task" data-action="delete" data-id="${task.id}">×</button></div></article>`;}
function bindTaskActions(container){container.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>{const task=tasks.find(t=>t.id===btn.dataset.id);if(!task)return;const action=btn.dataset.action;if(action==="toggle"){task.completed=!task.completed;persist();renderAll();toast(task.completed?"Task completed!":"Task moved back to in progress.");}if(action==="delete"){if(confirm(`Delete "${task.title}"?`)){tasks=tasks.filter(t=>t.id!==task.id);persist();renderAll();toast("Task deleted.");}}if(action==="edit"){fillForm(task);navigate("add");}}));}
function renderDashboard(){const total=tasks.length,done=tasks.filter(t=>t.completed).length,active=total-done,due=tasks.filter(t=>t.date===todayISO()&&!t.completed).length;document.getElementById("totalStat").textContent=total;document.getElementById("progressStat").textContent=active;document.getElementById("completedStat").textContent=done;document.getElementById("dueStat").textContent=due;document.getElementById("navTaskCount").textContent=active;const pct=total?Math.round(done/total*100):0;document.getElementById("completionRate").textContent=pct+"%";document.getElementById("progressRing").style.background=`conic-gradient(var(--purple) ${pct*3.6}deg,#eeeafc 0deg)`;document.getElementById("legendDone").textContent=done;document.getElementById("legendLeft").textContent=active;const list=document.getElementById("dashboardTasks");const today=tasks.filter(t=>t.date===todayISO()).sort((a,b)=>Number(a.completed)-Number(b.completed));list.innerHTML=today.slice(0,5).map(taskMarkup).join("");document.getElementById("dashboardEmpty").classList.toggle("hidden",today.length>0);bindTaskActions(list);}
function renderAllTasks(){const q=document.getElementById("taskSearch").value.toLowerCase(),filter=document.getElementById("taskFilter").value;let visible=tasks.filter(t=>(t.title+" "+t.description+" "+t.category).toLowerCase().includes(q));if(filter==="active")visible=visible.filter(t=>!t.completed);if(filter==="completed")visible=visible.filter(t=>t.completed);visible.sort((a,b)=>Number(a.completed)-Number(b.completed)||a.date.localeCompare(b.date));const list=document.getElementById("allTasks");list.innerHTML=visible.map(taskMarkup).join("");document.getElementById("tasksEmpty").classList.toggle("hidden",visible.length>0);document.getElementById("taskCountPill").textContent=`${visible.length} ${visible.length===1?"task":"tasks"}`;document.getElementById("taskListSubtitle").textContent=filter==="all"?"All your tasks in one place":filter==="active"?"Tasks still in progress":"Tasks you've completed";bindTaskActions(list);}
function resetForm(){document.getElementById("taskForm").reset();document.getElementById("editId").value="";document.getElementById("taskDate").value=todayISO();document.getElementById("formTitle").textContent="Add a new task";document.getElementById("saveTaskButton").innerHTML='Save task <span>→</span>';}
function fillForm(task){document.getElementById("editId").value=task.id;document.getElementById("taskTitle").value=task.title;document.getElementById("taskDescription").value=task.description||"";document.getElementById("taskDate").value=task.date;document.getElementById("taskPriority").value=task.priority;document.getElementById("taskCategory").value=task.category;document.getElementById("formTitle").textContent="Edit task";document.getElementById("saveTaskButton").textContent="Update task →";}
document.getElementById("taskForm").addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("taskTitle").value.trim(),date=document.getElementById("taskDate").value;if(!title||!date){toast("Please complete the required fields.");return;}const id=document.getElementById("editId").value;const data={title,description:document.getElementById("taskDescription").value.trim(),date,priority:document.getElementById("taskPriority").value,category:document.getElementById("taskCategory").value};if(id){tasks=tasks.map(t=>t.id===id?{...t,...data}:t);toast("Task updated successfully.");}else{tasks.unshift({id:crypto.randomUUID(),...data,completed:false});toast("New task added.");}persist();renderAll();resetForm();navigate("tasks");});
document.getElementById("cancelForm").addEventListener("click",()=>{resetForm();navigate("tasks");});
document.getElementById("taskSearch").addEventListener("input",renderAllTasks);document.getElementById("taskFilter").addEventListener("change",renderAllTasks);
function renderCalendar(){const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();document.getElementById("calendarMonth").textContent=calendarCursor.toLocaleDateString(undefined,{month:"long",year:"numeric"});const grid=document.getElementById("calendarGrid");const names=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];grid.innerHTML=names.map(n=>`<div class="calendar-day-name">${n}</div>`).join("");const first=new Date(year,month,1),start=first.getDay(),days=new Date(year,month+1,0).getDate(),prevDays=new Date(year,month,0).getDate();for(let i=0;i<42;i++){let day,iso,muted=false;if(i<start){day=prevDays-start+i+1;iso=toISO(new Date(year,month-1,day));muted=true;}else if(i>=start+days){day=i-(start+days)+1;iso=toISO(new Date(year,month+1,day));muted=true;}else{day=i-start+1;iso=toISO(new Date(year,month,day));}const has=tasks.some(t=>t.date===iso);const btn=document.createElement("button");btn.className=`calendar-date ${muted?"muted-day":""} ${iso===todayISO()?"today":""} ${iso===selectedDate?"selected":""} ${has?"has-task":""}`;btn.textContent=day;btn.addEventListener("click",()=>{selectedDate=iso;if(new Date(iso+"T00:00:00").getMonth()!==month)calendarCursor=new Date(iso+"T00:00:00");renderCalendar();});grid.appendChild(btn);}renderSelectedDate();}
function toISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function renderSelectedDate(){document.getElementById("selectedDateTitle").textContent=new Date(selectedDate+"T00:00:00").toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});const dayTasks=tasks.filter(t=>t.date===selectedDate);const list=document.getElementById("selectedDateTasks");list.innerHTML=dayTasks.map(taskMarkup).join("");document.getElementById("calendarEmpty").classList.toggle("hidden",dayTasks.length>0);bindTaskActions(list);}
document.getElementById("prevMonth").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar();});document.getElementById("nextMonth").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar();});
document.getElementById("reminderToggle").addEventListener("change",e=>toast(e.target.checked?"Daily reminder enabled.":"Daily reminder disabled."));document.getElementById("compactToggle").addEventListener("change",e=>{document.body.classList.toggle("compact-mode",e.target.checked);toast("Display preference updated.");});
document.getElementById("exportButton").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(tasks,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="taskflow-tasks.json";a.click();URL.revokeObjectURL(a.href);toast("Tasks exported.");});
document.getElementById("clearButton").addEventListener("click",()=>{if(confirm("This will permanently remove all tasks saved in this browser. Continue?")){tasks=[];persist();renderAll();toast("All tasks cleared.");}});
function renderAll(){renderDashboard();renderAllTasks();renderCalendar();}
document.getElementById("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
document.getElementById("taskDate").value=todayISO();renderAll();


// Simple front-end demo sign-in. This is not production authentication.
const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const USER_NAME_KEY = "taskflow_user_name";
const USER_EMAIL_KEY = "taskflow_user_email";

function renderUserProfile(){
  const name = localStorage.getItem(USER_NAME_KEY) || "User";
  const email = localStorage.getItem(USER_EMAIL_KEY) || "";
  const firstName = name.trim().split(/\\s+/)[0] || "there";
  document.getElementById("welcomeUserName").textContent = firstName;
  document.getElementById("sidebarUserName").textContent = name;
  document.getElementById("settingsUserName").textContent = name;
  document.getElementById("settingsUserEmail").textContent = email;
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  ["sidebarAvatar","topAvatar","settingsAvatar"].forEach(id => {
    document.getElementById(id).textContent = initial;
  });
}
function showApp(){
  renderUserProfile();
  loginScreen.classList.add("hidden");
  appShell.classList.remove("logged-out");
}
function showLogin(){
  loginScreen.classList.remove("hidden");
  appShell.classList.add("logged-out");
  const savedName = localStorage.getItem(USER_NAME_KEY);
  const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
  if(savedName) document.getElementById("loginName").value = savedName;
  if(savedEmail) document.getElementById("loginEmail").value = savedEmail;
}
// Ask for a name again if an older version saved sign-in without a profile name.
if(localStorage.getItem("taskflow_signed_in")==="yes" && localStorage.getItem(USER_NAME_KEY)){
  showApp();
}else{
  localStorage.removeItem("taskflow_signed_in");
  showLogin();
}
document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("loginName").value.trim();
  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  if(!name || !email || !password){return;}
  localStorage.setItem(USER_NAME_KEY,name);
  localStorage.setItem(USER_EMAIL_KEY,email);
  localStorage.setItem("taskflow_signed_in","yes");
  showApp();
  toast(`Welcome to TaskFlow, ${name.split(/\\s+/)[0]}!`);
});
document.getElementById("logoutButton").addEventListener("click",()=>{
  localStorage.removeItem("taskflow_signed_in");
  showLogin();
  toast("You have signed out.");
});
function applyTheme(theme){
  document.body.classList.toggle("dark-mode",theme==="dark");
  const select=document.getElementById("themeSelect");
  if(select)select.value=theme;
  localStorage.setItem("taskflow_theme",theme);
}
const savedTheme=localStorage.getItem("taskflow_theme")||"light";
applyTheme(savedTheme);
document.getElementById("themeSelect").addEventListener("change",e=>{
  applyTheme(e.target.value);
  toast(e.target.value==="dark"?"Night mode enabled.":"Day mode enabled.");
});
