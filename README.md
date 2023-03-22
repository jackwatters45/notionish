# Todo list I created a while back adapted to use react

Random Notes

- drop down hover styling -> hover should go away from button when dropdown is open (maybe conditional render of the button idk)
- also if prop is disabled -> no hover (ex. ${(props) => props.disabled && hoverStyle}) only problem is rn the style is on an external div not the actual component
- might make sense for select to close when user selects and option
- projects logic -> exist as part of property
- maybe skip firebase background
- property object should hold all the sort info etc??
- trying to edit the is done property totally messes it up
- eventually rename to not be todo oriented
- use useContext for now but I think this is bad and dumb and all the data should just be backend idk
- eventually use draft js for notes section
- drag or click styling
- index file for exporting properties
- when a new property is added all the todos need to be updated
- notes hold a value and html?
- depending on hov i do labels may run into problem with hover
- prevent paste maybe - oncopy="return false" oncut="return false" onpaste="return false">
- for properties -> inline style and just get properties count for the repeat
- view uses router (so does each todo but idk if necessary)
- may be better to use z-index for controlling clicks off popup and sidebar (if something needs to be closed etc) but for now just using state (main-context: line 68)
- property is upper case (not guaranteed) and is being converted to lowercase in the custom hooks. Probably a bad way to do this
- popup positioning is meh
- eventually done needs to just be turned into a checkbox property
- sidebar hovering is a bit sloppy
- i had some autofocuses in each view that i turned off so when new todo created needs to auto focus (but not when view changes)
- filter and sort should be visible when sidebar open

Next

- autofocus for create new todo (both views - also make sure it looks good default)
- fix tab bs (if gonna take too long just skip)
- drag and drop

- backend (evaluate if even worth it - at the very least add a login)
- rename everything better + clean up
