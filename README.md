# Notion Task Manager App: README

## Overview

This project is a simple task management application that allows users to manage their tasks with customizable properties and views. It is a copy of the way in which I use Notion.io to manage my own personal tasks. Users can create, edit, and delete tasks, as well as sort and filter them based on various properties.

## Example
![Screenshot 2023-04-08 at 6 39 30 PM](https://user-images.githubusercontent.com/70183051/230754531-eb10ffc4-2c66-40a7-9f49-d930e29b6a18.jpg)

## Key Components

- **App**: The main component that handles user authentication, database setup, and routing.
- **RootLayout**: The layout component that manages the views and properties for each view, as well as the sidebar for individual task details.
- **Database**: The component responsible for rendering the tasks as specified by the view and properties.
- **Sidebar**: The component that displays the details of a selected task and allows the user to edit properties and add notes.

## Usage

- **Authentication**: Users can sign in or sign up using their Google, Github, or Facebook login if they wish to save their data, or continue without logging in to use the app without saving their data.
- **Views**: The user is provided with two 'views', which allow them to view their dbItems in different formats (currently table and board). Views also allow them to sort and filter their tasks in different ways. The user can create their own views by clicking the 'Add view' button in the navigation bar.
- **Task Management**: The user can create new tasks which can be edited inline in the table view or in the sidebar in either view. Tasks can be deleted by clicking the 'Done?' checkbox. Properties can be added, edited, or removed by clicking the '+' button next to the property name in the table header or the sidebar.
- **Notes**: The user can add notes to a task in the notes section which can be found in the sidebar

## Dependencies

- React
- React Router
- Firebase Authentication
- Firebase Firestore
- styled-components
- react-dnd

## Learning Takeaways

- **Separated backend and frontend data changes**: Wanted all changes to be rendered quickly but also saved immediately. To do this I separated the data changes into two parts: the frontend and the backend. The frontend changes are rendered immediately, and the backend changes are saved to the database. This allows the user to see their changes immediately, but also ensures that their data is saved in case of a crash or other error.
- **React Router**: Got a lot more comfortable using React Router to handle navigation of views and tasks.
- **React Hooks**: Became much more comfortable with some of the more intermediate hooks ( useRef , useCallback, useMemo, useLayoutEffect).
- **react-dnd**: First time using a drag and drop library
- **Working with a large app**: This was the first time I worked on a project of this size, and I learned a lot about how to organize my code and components to make it easier to work with.
- **Working with modals/dropdowns/popups**: This was the first time I seriously worked with modals, dropdowns, and popups, and I learned a lot about how to implement them and how to make them work with the rest of the app.
- **Content Editable Divs**: Notion uses content editable divs to allow text wrapping. I had never used them before and learned how to use them. Implemented a custom hook for each of my different property types that used them.

### License

This project is licensed under the MIT License.
