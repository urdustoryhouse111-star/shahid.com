# TaskFlow – To-Do List Application

A responsive five-screen task management app built with HTML, CSS and vanilla JavaScript.

## Run in Visual Studio Code
1. Download and extract `TaskFlow_ToDo_App.zip`.
2. Open the extracted `TaskFlow_ToDo_App` folder in VS Code.
3. Open `index.html` in your browser.
4. Recommended: install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

No npm install, build step, or backend is required.

## Screens
0. Login – simple demo sign-in screen (any valid email and non-empty password).
1. Dashboard – task statistics, today's tasks and completion progress.
2. My Tasks – searchable/filterable list with complete, edit and delete actions.
3. Add Task – validated form for title, description, due date, priority and category.
4. Calendar – monthly calendar with task markers and selected-day task list.
5. Settings – reminder/display preferences, JSON export and clear-all action.

## Features
- Add, edit, delete and complete tasks.
- Search tasks and filter by status.
- Tasks persist in browser localStorage.
- Export tasks to JSON.
- Responsive layout for desktop, tablet and mobile.
- Day mode and night mode switch in Settings.
- Demo sign-in/sign-out screen; it is front-end only and does not provide secure accounts.
- Sample tasks appear on first launch; delete them and add your own.

## HCI principles used
- Consistency: shared typography, colors, controls and navigation.
- Visibility: task counts, priorities, due dates and progress are visible.
- Feedback: toast messages confirm task actions.
- User control: edit, delete, complete and undo completion.
- Error prevention: required fields, title length limits and delete confirmation.
- Recognition over recall: labeled navigation, familiar icons and visible filters.
- Simplicity: uncluttered screens and progressive grouping of information.

## Notes
- Data is stored locally in the browser where the app is opened. It is not synced between devices.
- The profile name is sample UI content and can be changed in `index.html`.
- Google Fonts are loaded from the internet; system sans-serif fonts are used as fallback.
\n\n**User profile:** The login form asks for your name and email. Your name appears in the dashboard greeting, sidebar profile, avatar initials, and Settings profile. These demo details are saved in your browser's local storage.\n